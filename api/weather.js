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

  // Define the WEATHER_API_KEY
  // It's good practice to keep this in environment variables for production
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // Make sure this is set in your environment

  try {
    // Fetch weather data for the Philippines
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=Philippines&aqi=no`
    );

    if (!weatherResponse.ok) {
      throw new Error(
        `Failed to fetch weather data with status ${weatherResponse.status}`
      );
    }

    const weatherData = await weatherResponse.json();

    // Send only the weather data in the response
    res.status(200).json({ weather: weatherData });
  } catch (error) {
    console.error("❌ Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
