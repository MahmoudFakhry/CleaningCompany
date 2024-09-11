import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 
import './Payment.css';

const Payment = ({ onBack2, formData }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'cardNumber':
        setCardNumber(value);
        break;
      case 'expiryDate':
        setExpiryDate(value);
        break;
      case 'cvv':
        setCvv(value);
        break;
      default:
        break;
    }
  };

  const validatePayment = () => {
    const errors = {};
    if (!cardNumber) errors.cardNumber = 'Card number is required.';
    if (!expiryDate) errors.expiryDate = 'Expiry date is required.';
    if (!cvv) errors.cvv = 'CVV is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePayment()) {
      const hourlyRate = 45;  
      const estimatedHoursLow = 2;  
      const estimatedHoursHigh = 4; 
      const totalCostLow = hourlyRate * estimatedHoursLow;
      const totalCostHigh = hourlyRate * estimatedHoursHigh;

      try {
        await addDoc(collection(db, 'bookings'), {
          ...formData,
          cardNumber,
          expiryDate,
          totalCostLow,
          totalCostHigh,
          timestamp: new Date(), // Add a timestamp
        });
        console.log('Booking saved successfully!');
      } catch (error) {
        console.error('Error saving booking:', error);
      }

      // Navigate to the thank-you page with formData passed in the state
      navigate('/thank-you', { state: { formData, totalCostLow, totalCostHigh, estimatedHoursLow, estimatedHoursHigh } });
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment Information</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardNumber}
            onChange={handleChange}
            className="payment-input"
          />
          {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date:</label>
          <input
            type="month"
            id="expiryDate"
            name="expiryDate"
            value={expiryDate}
            onChange={handleChange}
            className="payment-input"
          />
          {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={cvv}
            onChange={handleChange}
            className="payment-input"
          />
          {errors.cvv && <div className="error-message">{errors.cvv}</div>}
        </div>
        <div className="button-group">
          <button type="button" onClick={onBack2} className="nav-button">Back</button>
          <button type="submit" className="submit-button">Submit Payment</button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
