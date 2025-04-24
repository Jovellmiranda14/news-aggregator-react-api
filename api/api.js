const axios = require('axios');

// and we need jsdom and Readability to parse the article HTML
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const API_KEY =
    process.env.NEWS_API_KEY || "ea9029c383a84daf85d82e8c680bf37c";
  const { q = "" } = req.query;

  try {
    let url = `${process.env.BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`;

    if (q) {
      const encodedTerm = encodeURIComponent(q.trim());

      switch (q.toLowerCase()) {
        case "wallstreet":
        case "wsj":
        case "wall street journal":
          url = `${process.env.BASE_URL}/everything?domains=wsj.com&apiKey=${API_KEY}`;
          break;
        case "techcrunch":
          url = `${process.env.BASE_URL}/top-headlines?sources=techcrunch&apiKey=${API_KEY}`;
          break;
        case "business":
          url = `${process.env.BASE_URL}/top-headlines?country=us&category=business&apiKey=${API_KEY}`;
          break;
        case "tesla":
          url = `${process.env.BASE_URL}/everything?q=tesla&from=2025-03-23&sortBy=publishedAt&apiKey=${API_KEY}`;
          break;
        case "apple":
          url = `${process.env.BASE_URL}/everything?q=apple&from=2025-03-31&to=2025-03-31&sortBy=popularity&apiKey=${API_KEY}`;
          break;
        default:
          url = `${process.env.BASE_URL}/everything?q=${encodedTerm}&apiKey=${API_KEY}`;
          break;
      }
    }

    // Fetch articles from NewsAPI
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const data = await response.json();
    const articles = data.articles || [];

    // Fetch full content for each article
    const fullArticles = await Promise.all(
      articles.map(async (article) => {
        try {
          const articleHtml = await axios.get(article.url); // Get HTML content of the article
          const dom = new JSDOM(articleHtml.data, { url: article.url });
          const readableArticle = new Readability(dom.window.document).parse();
          return {
            ...article,
            content: readableArticle.textContent, // Extracted article content
          };
        } catch (error) {
          console.error("Error fetching article content:", error.message);
          return article; // Return original article if there's an error fetching content
        }
      })
    );

    res.status(200).json({ articles: fullArticles });
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
}
