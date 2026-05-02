import React from 'react';

const WeatherCard = ({ data }) => {
  if (!data) return null;

  return (
    <div id="weather-data" className="state-container">
      <h2 id="city-name">{data.name}</h2>
      <div className="temp-container">
        <span id="temperature">{Math.round(data.main.temp)}</span>
        <span className="unit">°C</span>
      </div>
      <p id="condition" className="condition">
        {data.weather[0].description}
      </p>
      <div className="details">
        <div className="detail">
          <span className="label">Humidity</span>
          <span id="humidity" className="value">
            {data.main.humidity}%
          </span>
        </div>
        <div className="detail">
          <span className="label">Wind</span>
          <span id="wind-speed" className="value">
            {data.wind.speed} m/s
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
