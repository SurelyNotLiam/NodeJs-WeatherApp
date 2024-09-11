const express = require("express");
const axios = require("axios");
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve the public folder as static files
app.use(express.static("public"));

// Render the index template with default values for weather and error
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

// Handle the /weather route
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  // If no city is provided, don't fetch weather data and return with an error
  if (!city) {
    return res.render("index", { weather: null, error: "Please enter a city name." });
  }

  const apiKey = '1caccea81ba9dcccde637acc94b77c42';
  const APIurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  let weather = null;
  let error = null;
  
  try {
    const response = await axios.get(APIurl);
    weather = response.data;
  } catch (err) {
    error = "Error, please try again.";
  }

  // Render the index template with the weather data or error message
  res.render("index", { weather, error });
});

// Start the server and listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});