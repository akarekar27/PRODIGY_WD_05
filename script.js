let weather = {
  apiKey: "9ce95d6cc96086e28ba8be4de15f17a9",
  
  // Function to fetch weather data
  fetchWeather: function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => console.error("Error fetching weather:", error));
  },

  // Function to display weather details
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");

    // Fetch and update background dynamically from Pexels API
    this.updateBackground(name);
  },

  // Function to fetch and update background from Pexels API
  updateBackground: async function (city) {
    const pexelsApiKey = "f6kTKTUkGPDVFrzAtJD97JWAgrqOCfTI1SFeq8YfHZkNnCy1qT5erVUS"; // Replace with your Pexels API Key
    const apiUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: pexelsApiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch background image");
      }

      const data = await response.json();

      if (data.photos.length > 0) {
        const imageUrl = data.photos[0].src.original; // Get the image URL
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.transition = "background 0.5s ease-in-out";
      } else {
        console.warn("No image found for this city. Using default background.");
        this.setDefaultBackground();
      }
    } catch (error) {
      console.error("Error fetching background image:", error);
      this.setDefaultBackground();
    }
  },

  // Fallback for default background image if Pexels API fails
  setDefaultBackground: function () {
    document.body.style.backgroundImage = `url('https://cdn.pixabay.com/photo/2015/09/18/17/27/clouds-949850_1280.jpg')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background 0.5s ease-in-out";
  },

  // Function to search for weather by city name
  search: function () {
    const city = document.querySelector(".search-bar").value.trim();
    if (city) {
      this.fetchWeather(city);
    } else {
      alert("Please enter a city name.");
    }
  },
};

// Event listeners
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});

// Default weather display (initially showing Mumbai)
weather.fetchWeather("Mumbai");
