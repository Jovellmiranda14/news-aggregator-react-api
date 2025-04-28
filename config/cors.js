export default function setCorsHeaders(req, res) {
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
  
    return false;
  }