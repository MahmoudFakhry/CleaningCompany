import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './ContactUs.css';

const ContactUs = () => {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  useEffect(() => {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.username) {
        setUserName(user.username);
      }
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
     
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSuccessMessage('Message sent successfully!');
        setMessage('');
      } catch (error) {
        setErrors({ general: 'An error occurred while sending your message. Please try again later.' });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="not-logged-in">
        <h1>Please log in to access additional features.</h1>
      </div>
    );
  }

  return (
    <div className="contact-us">
      <Navbar />
      <div className="contact-container">
        <h1>Contact Us</h1>
        <div className="contact-info">
          <p>For immediate assistance, call us at <strong>111-111-111</strong>. Alternatively, send us a message below.</p>
        </div>
        <div className="user-profile">
          <h2>Hello, {userName}</h2>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleChange}
              className={`form-control ${errors.message ? 'error' : ''}`}
              rows="4"
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>
          <button type="submit" className="contact-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.general && <p className="error-message">{errors.general}</p>}
      </div>
    </div>
  );
};

export default ContactUs;
