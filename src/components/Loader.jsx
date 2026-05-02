import React from 'react';

const Loader = ({ city }) => {
  return (
    <div id="loading" className="state-container">
      <div className="spinner"></div>
      <p>Fetching weather data for {city}...</p>
    </div>
  );
};

export default Loader;
