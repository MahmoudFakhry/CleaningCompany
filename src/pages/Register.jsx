import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword, sendEmailVerification } from '../firebaseConfig';
import Navbar from '../components/Navbar';
import './Register.css';

const Register = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('register');
  const [countdown, setCountdown] = useState(60);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentStep === 'verify') {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setCurrentStep('register');
            setSuccessMessage('Verification time expired. Please register again.');
            setError('');
            clearInterval(timer);
            return 60;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isRegistering) {
      setFormData({ ...formData, [name]: value });
    } else {
      setLoginData({ ...loginData, [name]: value });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
        setCurrentStep('verify');
        setSuccessMessage('Registration successful! Please check your email for verification.');
        setError('');
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setErrors({});
      } catch (error) {
        setError(error.message);
        setErrors({});
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length === 0) {
      // Perform login logic here
      setSuccessMessage('Login successful!');
      setLoginData({ email: '', password: '' });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleLogout = () => {
    // Perform logout logic here
    navigate('/');
  };

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-container">
        <h1 className="register-title">
          {currentStep === 'register' ? (isRegistering ? 'Create an Account' : 'Log In') : 'Check Your Email'}
        </h1>
        <div className="register-toggle">
          {currentStep === 'register' && (
            <>
              <button onClick={() => setIsRegistering(true)} className={`toggle-button ${isRegistering ? 'active' : ''}`}>
                Sign Up
              </button>
              <button onClick={() => setIsRegistering(false)} className={`toggle-button ${!isRegistering ? 'active' : ''}`}>
                Log In
              </button>
            </>
          )}
        </div>
        {currentStep === 'register' ? (
          isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-control ${errors.username ? 'error' : ''}`}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? 'error' : ''}`}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
              {error && <span className="error-message">{error}</span>}
              <button type="submit" className="register-button">Register</button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? 'error' : ''}`}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              {errors.general && <span className="error-message">{errors.general}</span>}
              <button type="submit" className="login-button">Log In</button>
            </form>
          )
        ) : (
          <div className="verify-container">
            <p className="verify-message">Please check your email for the verification link. You have {countdown} seconds remaining.</p>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
        <button onClick={handleLogout} className="logout-button">Log Out</button>
      </div>
    </div>
  );
};

export default Register;
