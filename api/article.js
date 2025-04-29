import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const decodedUrl = decodeURIComponent(url);
    const articlePage = await fetch(decodedUrl);

    if (!articlePage.ok) {
      return res.status(articlePage.status).json({
        error: `Failed to fetch URL: ${articlePage.statusText}`,
      });
    }

    const html = await articlePage.text();
    const dom = new JSDOM(html, { url: decodedUrl });

    const article = new Readability(dom.window.document).parse();

    if (!article) {
      return res.status(404).json({ error: "Unable to parse the article content." });
    }

    res.status(200).json({
      title: article.title,
      content: article.content,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Failed to fetch full article" });
  }
}
