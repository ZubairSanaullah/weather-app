import { useState } from 'react';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import WeatherCard from './components/WeatherCard';
import './App.css';

// We are now using wttr.in for real-time weather data which does not require an API Key!

const MAJOR_CITIES = [
  "Tokyo", "Delhi", "Shanghai", "Sao Paulo", "Mumbai", "Beijing", "Cairo", "Dhaka",
  "Osaka", "New York", "Karachi", "Buenos Aires", "Chongqing", "Istanbul", "Kolkata",
  "Manila", "Lagos", "Rio de Janeiro", "Tianjin", "Kinshasa", "Guangzhou", "Los Angeles",
  "Moscow", "Shenzhen", "Lahore", "Bangalore", "Paris", "Bogota", "Jakarta", "Chennai",
  "Lima", "Bangkok", "Seoul", "Nagoya", "Hyderabad", "London", "Tehran", "Chicago",
  "Chengdu", "Nanjing", "Wuhan", "Ho Chi Minh City", "Luanda", "Ahmedabad", "Kuala Lumpur",
  "Hong Kong", "Dongguan", "Foshan", "Hangzhou", "Pune", "Riyadh", "Santiago", "Madrid",
  "Dallas", "Toronto", "Singapore", "Barcelona", "Dubai", "Sydney", "Melbourne", "Berlin",
  "Rome", "Cape Town", "Johannesburg", "San Francisco", "Amsterdam", "Vienna", "Frankfurt",
  "Stockholm", "Zurich", "Copenhagen", "Oslo", "Helsinki", "Dublin", "Brussels", "Munich"
].sort();

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

    const normalizedInput = city.trim().toLowerCase();
    const isValidMajorCity = MAJOR_CITIES.some(
      (majorCity) => majorCity.toLowerCase() === normalizedInput
    );

    if (!isValidMajorCity) {
      setError("Please enter the entire and valid name of a major city.");
      setLoading(false);
      return;
    }

    try {
      // --- REAL API BLOCK (wttr.in) ---
      const response = await fetch(`https://wttr.in/${city}?format=j1`);
      
      if (!response.ok) {
        throw new Error("City not found.");
      }

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

      // Get city and country for display
      const cityName = area.areaName[0].value;
      const country = area.country[0].value;

      // For wttr.in API, we trust that if we got a response with weather data,
      // it's for a valid location. The API handles city name matching internally.
      // We only reject if the response is completely invalid.

      // Format data to match our WeatherCard structure
      const data = {
        name: `${cityName}, ${country}`,
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
            list="major-cities"
            placeholder="Enter major city name..."
            autoComplete="off"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <datalist id="major-cities">
            {MAJOR_CITIES.map((majorCity) => (
              <option key={majorCity} value={majorCity} />
            ))}
          </datalist>
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

        {loading && <Loader city={cityInput} />}
        {error && !loading && <ErrorMessage message={error} />}
        {weatherData && !loading && !error && <WeatherCard data={weatherData} />}
      </main>
    </div>
  );
}

export default App;
