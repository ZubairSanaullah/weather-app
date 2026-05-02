import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div id="error" className="state-container">
      <div className="error-icon">!</div>
      <p id="error-message">{message}</p>
    </div>
  );
};

export default ErrorMessage;
