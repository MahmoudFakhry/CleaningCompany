// ThankYou.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ThankYou.css'; // Ensure this file exists and is correctly linked

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    totalCostLow,
    totalCostHigh,
    estimatedHoursLow,
    estimatedHoursHigh
  } = location.state || {}; // Default to an empty object if no state is provided

  const handleBackToHome = () => {
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="thank-you-container">
      <h1>Thank You!</h1>
      <p>Your payment has been successfully processed. We appreciate your business!</p>
      <p>
        We charge $45 per hour, and based on the information you provided, you will likely be charged between ${totalCostLow} and ${totalCostHigh}.
        It will take approximately between {estimatedHoursLow} and {estimatedHoursHigh} hours. This is subject to change.
      </p>
      <button onClick={handleBackToHome} className="home-button">Back to Home</button>
    </div>
  );
};

export default ThankYou;
