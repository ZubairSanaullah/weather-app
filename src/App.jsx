import { useState } from 'react';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import WeatherCard from './components/WeatherCard';
import './App.css';

// We are now using wttr.in for real-time weather data which does not require an API Key!

function App() {
  const [cityInput, setCityInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      // --- MOCK DATA FOR DEMONSTRATION & SCREENSHOTS ---
      // We use setTimeout to simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (city.toLowerCase() === "error") {
        throw new Error("City not found");
      }

      if (city.toLowerCase() === "network") {
        throw new Error("Network error! Please check your connection.");
      }

      // --- REAL API BLOCK (wttr.in) ---
      const response = await fetch(`https://wttr.in/${city}?format=j1`);
      
      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error("City not found.");
      }

      if (!result.current_condition || result.current_condition.length === 0) {
        throw new Error("City not found.");
      }

      const current = result.current_condition[0];
      const area = result.nearest_area[0];

      // Format data to match our WeatherCard structure
      const data = {
        name: area.areaName[0].value,
        main: {
          temp: parseFloat(current.temp_C),
          humidity: parseFloat(current.humidity),
        },
        weather: [{ description: current.weatherDesc[0].value }],
        wind: { speed: (parseFloat(current.windspeedKmph) * 1000 / 3600).toFixed(1) }, // Convert km/h to m/s
      };

      setWeatherData(data);
      // ---------------------------------------------
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(cityInput);
  };

  return (
    <div className="container">
      <header>
        <h1>
          Weather <span className="highlight">Now</span>
        </h1>
      </header>

      <main className="card">
        <form id="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="city-input"
            placeholder="Enter city name..."
            autoComplete="off"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <button type="submit" id="search-btn">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {loading && <Loader />}
        {error && !loading && <ErrorMessage message={error} />}
        {weatherData && !loading && !error && <WeatherCard data={weatherData} />}
      </main>
    </div>
  );
}

export default App;
