import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import setCorsHeaders from "./cors.js";

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return;

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Make sure to decode the URL properly
    const decodedUrl = decodeURIComponent(url);

    // Fetch the content of the URL
    const articlePage = await fetch(decodedUrl);

    // Check if the response is successful
    if (!articlePage.ok) {
      throw new Error(`Failed to fetch URL: ${articlePage.status}`);
    }

    const text = await articlePage.text(); // Get the raw HTML
    const dom = new JSDOM(text, { url: decodedUrl });

    const article = new Readability(dom.window.document).parse();

    if (!article) {
      return res
        .status(404)
        .json({ error: "Unable to parse the article content." });
    }

    res.json({
      title: article.title,
      content: article.textContent,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch full article" });
  }
}
