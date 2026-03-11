export default async function handler(req, res) {

  const API_KEY = process.env.SERPAPI_KEY;

  const url =
  `https://serpapi.com/search.json?engine=google_jobs&q=jobs+Murrieta+CA&api_key=${API_KEY}`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch jobs"
    });

  }

}
