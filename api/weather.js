export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Change to specific domain in production
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Allow only GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  if (!WEATHER_API_KEY) {
    return res
      .status(500)
      .json({ error: "Weather API key is not configured." });
  }

  // Get location from query or default to "Philippines"
  const location = req.query.q || "Philippines";

  try {
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
        location
      )}&aqi=no`
    );

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather API responded with status ${weatherResponse.status}`
      );
    }

    const weatherData = await weatherResponse.json();

    // Send only the weather data
    res.status(200).json({ weather: weatherData });
  } catch (error) {
    console.error("❌ Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
