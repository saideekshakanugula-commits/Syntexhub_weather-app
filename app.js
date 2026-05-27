import React, { useState, useEffect } from "react";
import "./App.css";
import { FaMoon, FaSun, FaSearchLocation } from "react-icons/fa";

function App() {
  const API_KEY="38891c996027c635c00ecc6041bd297d";
  const [city, setCity] = useState("Hyderabad");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  const API_KEY = "YOUR_API_KEY";

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (searchCity) => {
    try {
      setLoading(true);
      setError("");

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error("City not found");
      }

      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
      );

      const forecastData = await forecastResponse.json();
      setForecast(forecastData.list.slice(0, 5));

      if (!history.includes(searchCity)) {
        setHistory([...history, searchCity]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        setLoading(true);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        setWeather(data);

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const forecastData = await forecastResponse.json();
        setForecast(forecastData.list.slice(0, 5));
      } catch (err) {
        setError("Unable to fetch location weather");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">
        <div className="top-bar">
          <h1>Weather Forecast App</h1>

          <button
            className="dark-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button onClick={() => fetchWeather(city)}>
            <FaSearchLocation /> Search
          </button>

          <button onClick={getLocationWeather}>Current Location</button>
        </div>

        {loading && <p className="loading">Loading...</p>}

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <p>Temperature: {weather.main.temp} °C</p>
            <p>Condition: {weather.weather[0].description}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </div>
        )}

        <h2>5-Day Forecast</h2>

        <div className="forecast-container">
          {forecast.map((item, index) => (
            <div className="forecast-card" key={index}>
              <p>{item.dt_txt}</p>

              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt="forecast icon"
              />

              <p>{item.main.temp} °C</p>
              <p>{item.weather[0].main}</p>
            </div>
          ))}
        </div>

        <div className="history">
          <h3>Search History</h3>

          {history.map((item, index) => (
            <button key={index} onClick={() => fetchWeather(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
