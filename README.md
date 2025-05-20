# INST377 Spring 2025 Final Project  
**Cinthia Contreras**

## 🌦️ Weatherly  
[Live Website]

Weatherly is a user-friendly weather forecasting application that allows users to search for and save weather information by city and state. It displays current conditions, as well as 12-hour and 7-day forecasts using visual charts. Users can also save locations, which are stored using Supabase as a backend database.

### Intended Users
This app is designed for:
- Travelers needing weather updates
- People planning outdoor activities
- Daily commuters
- Anyone who wants quick access to reliable forecast data

---

## Developer Manual

### How to Set Up & Run the App
1. **Clone the repository** from GitHub.
2. Open the `frontend/help.html` file in any browser (or run a local server using Live Server in VS Code).
3. The app will load in your browser and you can begin searching for weather information.

>  The app uses OpenWeatherMap’s API and Supabase for backend functionality. No local server or backend code is required to be run manually.

### How to Run Tests
No automated tests were included, but basic testing was done through:
- `console.log()` and `console.error()` statements in the JavaScript console
- Inspecting browser developer tools to verify API responses and error handling

---

## APIs Used

### **OpenWeatherMap API**
Used to retrieve geolocation and weather data for the searched city/state.

- **GET `/geo/1.0/direct`**: Gets latitude and longitude from a city and state.
- **GET `/data/3.0/onecall`**: Fetches detailed weather information (current, hourly, daily) using coordinates.

### **Supabase (PostgreSQL Backend)**
Used to store and retrieve saved locations.

- **POST** `supabase.from('locations').insert(...)`: Saves a city and state to the database.
- **GET** `supabase.from('locations').select('*')`: Retrieves all saved locations to display on the page.

---

## Future Development Ideas
- Add **user authentication** with Supabase to allow users to manage personal saved locations.
- Improve **responsiveness** and mobile support.
- Display **more weather metrics** (e.g., UV index, precipitation probability).

---

## Technologies Used
- HTML, CSS, JavaScript
- [Chart.js](https://www.chartjs.org/) for weather visualizations
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Supabase](https://supabase.com/) for backend/database storage

---

> 2025 INST377 Final Project – Cinthia Contreras
 