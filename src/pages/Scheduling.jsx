import React, { useState } from 'react';
import './Scheduling.css';

const Scheduling = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState({});

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleConfirm = () => {
    if (!date || !time) {
      setErrors({
        date: !date ? 'Date is required.' : '',
        time: !time ? 'Time is required.' : '',
      });
      return;
    }
    setErrors({});
    // Store scheduling data if needed
    // Redirect to Payment page
    window.location.href = '/payment';
  };

  return (
    <div className="scheduling-container">
      <h2>Schedule Your Appointment</h2>
      <div className="scheduling-form">
        <div className="form-group">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleDateChange}
            className="scheduling-input"
          />
          {errors.date && <div className="error-message">{errors.date}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="time">Select Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={time}
            onChange={handleTimeChange}
            className="scheduling-input"
          />
          {errors.time && <div className="error-message">{errors.time}</div>}
        </div>
        <button onClick={handleConfirm} className="nav-button">Confirm</button>
      </div>
    </div>
  );
};

export default Scheduling;
