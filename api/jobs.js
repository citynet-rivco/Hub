export default async function handler(req, res) {
  try {

    const API_KEY = process.env.SERPAPI_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Missing SERPAPI_KEY environment variable"
      });
    }

    // Cities served by the hub
    const cities = [
      "Murrieta CA",
      "Temecula CA",
      "Menifee CA",
      "Lake Elsinore CA",
      "Wildomar CA"
    ];

    // Job categories to search
    const categories = [
      "entry level jobs",
      "hiring immediately",
      "retail jobs",
      "warehouse jobs",
      "part time jobs",
      "customer service jobs"
    ];

    const allJobs = [];

    // Run searches for each city and category
    for (const city of cities) {

      for (const category of categories) {

        const query = `${category} ${city}`;

        const url =
          `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&location=Riverside,California&api_key=${API_KEY}`;

        const response = await fetch(url);

        const data = await response.json();

        if (data.jobs_results) {
          allJobs.push(...data.jobs_results);
        }

      }

    }

    // Remove duplicates
    const seen = new Set();

    const uniqueJobs = allJobs.filter(job => {

      const key =
        `${job.title}|${job.company_name}|${job.location}`;

      if (seen.has(key)) return false;

      seen.add(key);

      return true;

    });

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
