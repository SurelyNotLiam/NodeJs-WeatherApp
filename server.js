const express = require("express");
const axios = require("axios");
const app = express();
require('dotenv').config();

// Unsplash API Key
const unsplashAccessKey = process.env.unsplashPASS;

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the public folder as static files
app.use(express.static("public"));

// Render the index template with default values for weather, error, and image
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null, imageUrl: null });
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const weatherAPIKey = process.env.weatherPASS;
  const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPIKey}`;

  let weather = null;
  let error = null;
  let imageUrl = null;

  try {
    // Fetch weather data from OpenWeatherMap
    const weatherResponse = await axios.get(weatherAPIUrl);
    weather = weatherResponse.data;

    // Fetch image from Unsplash based on the city
    const unsplashAPIUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashAccessKey}`;
    const unsplashResponse = await axios.get(unsplashAPIUrl);
    imageUrl = unsplashResponse.data.urls.regular;

  } catch (err) {
    // Log the actual error to console
    console.error("Error fetching data:", err.message || err);
    error = "Error, please try again.";
  }

  // Render the index template with weather data, error message, and image URL
  res.render("index", { weather, error, imageUrl });
});

// Start the server and listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
