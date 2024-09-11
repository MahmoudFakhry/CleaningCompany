import React, { useState } from 'react';
import Payment from './Payment';
import './Scheduling.css';

const Scheduling = ({ onBack, formData }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showPayment, setShowPayment] = useState(false);

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
    setShowPayment(true);
  };

  return (
    <div className="scheduling-container">
      {showPayment ? (
        <Payment
          onBack2={() => setShowPayment(false)}
          formData={{ ...formData, date, time }}
        />
      ) : (
        <>
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
            <div className="button-group">
              <button onClick={onBack} className="nav-button">Back</button>
              <button onClick={handleConfirm} className="nav-button">Confirm</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Scheduling;
