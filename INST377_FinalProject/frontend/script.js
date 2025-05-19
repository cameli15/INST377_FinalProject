const API_KEY = "54effa13e97a20fa3a222e74b5154c5e";

document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://vminfuaibgmxsfqwuwnz.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaW5mdWFpYmdteHNmcXd1d256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTA3ODQsImV4cCI6MjA2MzE4Njc4NH0.3vWjH4XFTeb_a7o0z8lqxbI7YPbKvQQXmhl8Ou_oquM";

  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function handleFormSubmission(cityName, stateCode) {
    const submissionMessage = document.getElementById("submissionMessage");

    if (!cityName || !stateCode) {
      submissionMessage.textContent = "Please enter both city and state initials.";
      return;
    }

    try {
      submissionMessage.textContent = "Fetching data, please wait...";
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},US&limit=1&appid=${API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length === 0) {
        submissionMessage.textContent = "Location not found. Please check your input.";
        return;
      }

      const { lat, lon } = geocodeData[0];

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();

      displayWeatherData(cityName, stateCode, weatherData);
    } catch (error) {
      console.error("Error fetching data:", error);
      submissionMessage.textContent = "An error occurred. Please try again.";
    }
  }

  document.getElementById("locationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const cityName = document.getElementById("cityName").value;
    const stateCode = document.getElementById("stateCode").value.toUpperCase();
    handleFormSubmission(cityName, stateCode);
  });

  document.getElementById("saveLocationButton").addEventListener("click", () => {
    const cityName = document.getElementById("cityName").value;
    const stateCode = document.getElementById("stateCode").value.toUpperCase();

    if (!cityName || !stateCode) {
      alert("Please enter both city and state initials before saving.");
      return;
    }

    saveLocation(cityName, stateCode);
  });

  function displayWeatherData(cityName, stateCode, weatherData) {
    const { current, hourly, daily } = weatherData;
    const weatherSection = document.getElementById("weatherDisplay");

    weatherSection.innerHTML = `
      <h2>Weather for ${cityName}, ${stateCode}</h2>
      <p><strong>Temperature:</strong> ${(current.temp - 273.15).toFixed(1)} °C</p>
      <p><strong>Wind Speed:</strong> ${current.wind_speed} m/s</p>
      <p><strong>Humidity:</strong> ${current.humidity}%</p>
    `;

    createHourlyChart(hourly);
    createDailyChart(daily);
  }

  let hourlyChartInstance;
  let dailyChartInstance;

  function createHourlyChart(hourlyData) {
    const labels = hourlyData.slice(0, 12).map((_, i) => `Hour ${i + 1}`);
    const temps = hourlyData.slice(0, 12).map(d => (d.temp - 273.15).toFixed(1));
    const ctx = document.getElementById("hourlyChart").getContext("2d");

    if (hourlyChartInstance) hourlyChartInstance.destroy();
    hourlyChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Hourly Temperature (°C)",
          data: temps,
          borderColor: "blue",
          backgroundColor: "rgba(135,206,250,0.5)",
        }],
      },
    });
  }

  function createDailyChart(dailyData) {
    const labels = dailyData.slice(0, 7).map((_, i) => `Day ${i + 1}`);
    const temps = dailyData.slice(0, 7).map(d => (d.temp.day - 273.15).toFixed(1));
    const ctx = document.getElementById("dailyChart").getContext("2d");

    if (dailyChartInstance) dailyChartInstance.destroy();
    dailyChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Daily Temperature (°C)",
          data: temps,
          backgroundColor: "rgba(135,206,250,0.7)",
          borderColor: "blue",
        }],
      },
    });
  }

async function saveLocation(cityName, stateCode) {
  const savedLocationsDiv = document.getElementById("savedLocations");

  console.log("Submitting to Supabase:", {
  cityName: cityName.trim(),
  stateCode: stateCode.trim()
});


  const { data, error } = await supabaseClient
    .from("locations")
    
    .insert([
      {
        city: cityName.trim(),
        state: stateCode.trim()
      }
    ]);

  if (error) {
    console.error("Supabase insert error:", error.message, error.details);
    alert("Error saving location: " + error.message);
    return;
  }

  const locationElement = document.createElement("h3");
  locationElement.textContent = `${cityName}, ${stateCode}`;
  savedLocationsDiv.appendChild(locationElement);
}



  async function loadSavedLocations() {
    const { data, error } = await supabaseClient.from("locations").select("*");
    if (error) {
      console.error("Supabase fetch error:", error);
      return;
    }

    const savedLocationsDiv = document.getElementById("savedLocations");
    data.forEach(loc => {
      const el = document.createElement("h3");
      el.textContent = `${loc.city}, ${loc.state}`;
      savedLocationsDiv.appendChild(el);
    });
  }

  loadSavedLocations();
});
