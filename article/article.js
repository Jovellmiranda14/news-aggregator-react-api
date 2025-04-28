const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

async function fetchArticle(req, res) {
  try {
    const { articlePage, decodedUrl } = req.body;

    // Get the raw HTML
    const text = await articlePage.text();
    const dom = new JSDOM(text, { url: decodedUrl });

    // Parse the article using Readability
    const article = new Readability(dom.window.document).parse();

    if (!article) {
      return res
        .status(404)
        .json({ error: "Unable to parse the article content." });
    }

    // Respond with the parsed article
    res.json({
      title: article.title,
      content: article.textContent,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the article." });
  }
}

export default fetchArticle;
