import React from 'react';
import Navbar from '../components/Navbar';
import './Homepage.css';

const Homepage = () => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  return (
    <div className="homepage">
      <Navbar />
      <header className="homepage-header">
        <h1 className="homepage-title">Clean</h1>
        <p className="homepage-tagline">The Ultimate in Premium Cleaning Services</p>
        <a href="/book" className="book-now-button">Book Now</a>
      </header>
      <section className="homepage-features">
        <div className="feature-item">
          <h2 className="feature-title">Premium Quality</h2>
          <p className="feature-description">Our team uses top-of-the-line products and equipment to ensure the highest standards of cleanliness and sanitation.</p>
        </div>
        <div className="feature-item">
          <h2 className="feature-title">Flexible Scheduling</h2>
          <p className="feature-description">Book our services at a time that suits you. We offer flexible scheduling to fit your busy lifestyle.</p>
        </div>
        <div className="feature-item">
          <h2 className="feature-title">Experienced Professionals</h2>
          <p className="feature-description">Our cleaning experts are highly trained and experienced, providing exceptional service every time.</p>
        </div>
      </section>
      {!isLoggedIn && (
        <div className="login-message">
          <p>You need to log in to access additional features.</p>
        </div>
      )}
      <footer className="homepage-footer">
        <p>Clean 2024 &copy; All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Homepage;
