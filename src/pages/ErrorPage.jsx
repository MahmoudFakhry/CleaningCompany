// src/pages/ErrorPage.js
import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/">Go back to Home</a>
    </div>
  );
};

export default ErrorPage;
