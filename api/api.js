import setCorsHeaders from "../config/cors";

export default async function handler(req, res) {
  // Set CORS headers using the helper function
  if (setCorsHeaders(req, res)) return;

  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const API_KEY =
    process.env.NEWS_API_KEY;
  const BASE_URL = process.env.BASE_URL ; // Default base URL
  const { q = "" } = req.query;

  try {
    let url = `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`;

    if (q) {
      const encodedTerm = encodeURIComponent(q.trim());

      switch (q.toLowerCase()) {
        case "wallstreet":
        case "wsj":
        case "wall street journal":
          url = `${BASE_URL}/everything?domains=wsj.com&apiKey=${API_KEY}`;
          break;
        case "techcrunch":
          url = `${BASE_URL}/top-headlines?sources=techcrunch&apiKey=${API_KEY}`;
          break;
        case "business":
          url = `${BASE_URL}/top-headlines?country=us&category=business&apiKey=${API_KEY}`;
          break;
        case "tesla":
          url = `${BASE_URL}/everything?q=tesla&from=2025-03-23&sortBy=publishedAt&apiKey=${API_KEY}`;
          break;
        case "apple":
          url = `${BASE_URL}/everything?q=apple&from=2025-03-31&to=2025-03-31&sortBy=popularity&apiKey=${API_KEY}`;
          break;
        default:
          url = `${BASE_URL}/everything?q=${encodedTerm}&apiKey=${API_KEY}`;
          break;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const data = await response.json();
    const articles = data.articles || [];

    res.status(200).json({ articles });
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
}
