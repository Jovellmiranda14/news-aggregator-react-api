export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Change to your frontend domain if needed
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // stop further execution in handler
  }

  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const today = new Date();
  const formattedTeslaFromDate = new Date(today.setMonth(today.getMonth() - 1))
    .toISOString()
    .split("T")[0];
  const API_KEY = process.env.NEWS_API_KEY;
  const BASE_URL = process.env.BASE_URL; // Default base URL
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
          url = `${BASE_URL}/everything?q=tesla&from=${formattedTeslaFromDate}&sortBy=publishedAt&apiKey=${API_KEY}`;
          break;
        case "sports":
          url = `${BASE_URL}/everything?q=sports&apiKey=${API_KEY}`;
          break;
        case "economics":
          url = `${BASE_URL}/everything?q=economics&apiKey=${API_KEY}`;
          break;
        case "apple":
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const formattedYesterday = yesterday.toISOString().split("T")[0];
          url = `${BASE_URL}/everything?q=apple&from=${formattedYesterday}&to=${formattedYesterday}&sortBy=popularity&apiKey=${API_KEY}`;
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
