import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from 'firebase/auth';
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
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(storedLoggedIn);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        setLoggedIn(true);
        localStorage.setItem('loggedIn', 'true');
      } else {
        setLoggedIn(false);
        localStorage.setItem('loggedIn', 'false');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentStep === 'verify') {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
          
            const user = auth.currentUser;
            if (user) {
              deleteUser(user)
                .then(() => {
                  setCurrentStep('register');
                  
                  setError('Verification time expired. Please register again.');
                  localStorage.removeItem('loggedIn');
                  setLoggedIn(false);
                })
                .catch((err) => {
                  setError(err.message);
                });
            } else {
              setCurrentStep('register');
              setSuccessMessage('Verification time expired. Please register again.');
              setError('');
            }
            clearInterval(timer);
            return 60;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        setRegistrationSuccess(false);
        setCurrentStep('register');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess]);

  useEffect(() => {
    if (verificationSent && currentStep === 'verify') {
      const checkVerification = setInterval(async () => {
        const user = auth.currentUser;
        await user.reload();
        if (user.emailVerified) {
          setRegistrationSuccess(true);
          setCurrentStep('success');
          clearInterval(checkVerification);
        }
      }, 1000);
      return () => clearInterval(checkVerification);
    }
  }, [verificationSent, currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
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
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ username: formData.username, email: formData.email }));
        setVerificationSent(true);
        setSuccessMessage('Account successfully created! You can return to Home now.');
        setCurrentStep('verify');
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
  

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length === 0) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
        if (userCredential.user.emailVerified) {
          setLoggedIn(true);
          localStorage.setItem('loggedIn', 'true'); 
          setSuccessMessage('Login Successful!');
          setLoginData({ email: '', password: '' });
          setErrors({});
      
          setTimeout(() => {
            navigate('/'); 
          }, 0); 
        } else {
          setError('Please verify your email before logging in.');
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('loggedIn'); 
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-container">
        <h1 className="register-title">
          {currentStep === 'register'
            ? isRegistering
              ? 'Create an Account'
              : 'Log In'
            : 'Check Your Email'}
        </h1>
        {registrationSuccess && <p className="success-message">{successMessage}</p>}
        <div className="register-toggle">
          {currentStep === 'register' && !loggedIn && (
            <>
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setErrors({});
                  setError('');
                }}
                className={`toggle-button ${isRegistering ? 'active' : ''}`}
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setErrors({});
                  setError(''); 
                }}
                className={`toggle-button ${!isRegistering ? 'active' : ''}`}
              >
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
              <button type="submit" className="submit-button">
                Register
              </button>
              {error && <span className="error-message">{error}</span>}
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="register-form">
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
              <button type="submit" className="submit-button">Log In</button>
              <button
                type="button"
                className="forgot-password-button"
                onClick={() => navigate('/forgot-password')} 
              > 


                Forgot Password?
              </button>
              {error && <span className="error-message">{error}</span>}
            </form>
          )
        ) : (
          <div className="verify-message">
            <p>Please check your email for verification. You have {countdown} seconds remaining.</p>
          </div>
        )}
      </div>
      {loggedIn && (
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      )}
    </div>
  );
};

export default Register;
