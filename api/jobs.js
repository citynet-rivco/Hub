let cachedJobs = null;
let lastFetch = 0;

const CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours

export default async function handler(req, res) {
  try {

    const API_KEY = process.env.SERPAPI_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Missing SERPAPI_KEY environment variable"
      });
    }

    // Return cached jobs if within 24 hours
    if (cachedJobs && Date.now() - lastFetch < CACHE_TIME) {
      return res.status(200).json({
        jobs_results: cachedJobs
      });
    }

    const queries = [
      "entry level jobs Murrieta CA",
      "entry level jobs Temecula CA",
      "entry level jobs Menifee CA",
      "entry level jobs Lake Elsinore CA",
      "entry level jobs Wildomar CA"
    ];

    const allJobs = [];

    for (const q of queries) {

      const url =
        `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(q)}&location=Riverside,California&api_key=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.jobs_results) {
        allJobs.push(...data.jobs_results);
      }

    }

    // Remove duplicate jobs
    const seen = new Set();

    const uniqueJobs = allJobs.filter(job => {

      const key =
        `${job.title}|${job.company_name}|${job.location}`;

      if (seen.has(key)) return false;

      seen.add(key);

      return true;

    });

    // Save cache
    cachedJobs = uniqueJobs;
    lastFetch = Date.now();

    return res.status(200).json({
      jobs_results: uniqueJobs
    });

  } catch (error) {

    console.error("API ERROR:", error);

    return res.status(500).json({
      error: "Serverless function failed"
    });

  }
}