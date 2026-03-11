export default async function handler(req, res) {
  try {

    const API_KEY = process.env.SERPAPI_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Missing SERPAPI_KEY environment variable"
      });
    }

    const url =
      `https://serpapi.com/search.json?engine=google_jobs&q=jobs+Murrieta+CA&api_key=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    console.error("API ERROR:", error);

    return res.status(500).json({
      error: "Serverless function failed"
    });

  }
}
