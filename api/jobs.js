import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 1. CORS Headers: Securely allow your City Net frontend to read the data
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to 'https://citynet.org' in production
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  // Handle browser pre-flight checks
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ------------------------------------------------------------------
    // FRONTEND ACTION: Serve the cached data to users (Costs 0 API Credits)
    // ------------------------------------------------------------------
    if (req.query.action === 'get_cache') {
      const cachedJobs = await kv.get('citynet_jobs_cache');
      return res.status(200).json({ jobs_results: cachedJobs || [] });
    }

    // ------------------------------------------------------------------
    // CRON ACTION: Fetch from SerpApi and update cache (Costs 5 API Credits)
    // ------------------------------------------------------------------
    // Protect this route so random web traffic can't trigger an API burn
    const CRON_SECRET = process.env.CRON_KEY;
    if (!req.query.cron_key || req.query.cron_key !== CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized. Invalid cron key.' });
    }

    const SERP_API_KEY = process.env.SERP_API_KEY;
    if (!SERP_API_KEY) {
      return res.status(500).json({ error: 'Server misconfiguration: Missing SERP API Key' });
    }

    const TARGET_CITIES = ['Murrieta', 'Temecula', 'Lake Elsinore', 'Menifee', 'Wildomar'];
    let freshJobs = [];

    // Loop through the 5 cities and hit SerpApi 
    // (We use a standard for-loop to avoid rate-limiting the SerpApi connection itself)
    for (const city of TARGET_CITIES) {
      const query = encodeURIComponent(`entry level jobs hiring urgently`);
      const location = encodeURIComponent(`${city}, CA`);
      
      // Enforce Google Jobs to return English results, tailored to the specific city
      const url = `https://serpapi.com/search.json?engine=google_jobs&q=${query}&location=${location}&hl=en&api_key=${SERP_API_KEY}`;
      
      const apiRes = await fetch(url);
      const data = await apiRes.json();
      
      if (data.jobs_results && Array.isArray(data.jobs_results)) {
         // Stamp each job with the target city before merging it into the master array
         const normalized = data.jobs_results.map(job => ({ ...job, target_city: city }));
         freshJobs.push(...normalized);
      }
    }

    // Overwrite the Vercel KV database with the fresh batch of entry-level jobs
    if (freshJobs.length > 0) {
      await kv.set('citynet_jobs_cache', freshJobs);
    }

    // Return a success message to the Vercel Cron monitor
    res.status(200).json({ 
      success: true, 
      message: `Successfully refreshed cache with ${freshJobs.length} active jobs.` 
    });

  } catch (error) {
    console.error('Job Fetching/Caching Error:', error);
    res.status(500).json({ error: 'Internal Server Error during job sync.' });
  }
}
