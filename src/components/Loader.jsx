import React from 'react';

const Loader = () => {
  return (
    <div id="loading" className="state-container">
      <div className="spinner"></div>
      <p>Fetching weather data...</p>
    </div>
  );
};

export default Loader;
