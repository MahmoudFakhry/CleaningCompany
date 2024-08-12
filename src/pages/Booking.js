import React, { useState } from 'react';
import Scheduling from './Scheduling';
import Payment from './Payment';
import './BookingPage.css';

const questions = [

{
    id: 'team',
    text: 'What team would you like?',
    options: ['Red 🔴', 'Blue 🔵', 'Yellow 🟡', 'White ⚪', 'Black ⚫', 'Any team 🎨'],
    type: 'radio',
  },
  {
    id: 'expectations',
    text: 'Please provide a brief understanding of what we should expect:',
    type: 'text',
  },
  {
    id: 'rooms',
    text: 'What rooms do we clean?',
    options: [
      { value: 'Entire House', emoji: '🏠' },
      
      { value: 'Living Room', emoji: '🛋️' },
      { value: 'Bedroom', emoji: '🛏️' },
      { value: 'Kitchen', emoji: '🍽️' },
      { value: 'Bathroom', emoji: '🚿' },
      { value: 'Dining Room', emoji: '🍽️' },
      { value: 'Office', emoji: '💻' },
      { value: 'Hallway', emoji: '🚪' },
      { value: 'Basement', emoji: '🏡' },
      { value: 'Attic', emoji: '🏠' },
      { value: 'Laundry Room', emoji: '🧺' },
      { value: 'Garage', emoji: '🚗' },
      { value: 'Sunroom', emoji: '🌞' },
      { value: 'Library', emoji: '📚' },
      { value: 'Game Room', emoji: '🎮' },
      { value: 'Guest Room', emoji: '🛌' },
      { value: 'Pantry', emoji: '🥫' },
      { value: 'Mudroom', emoji: '🧤' },
      { value: 'Workshop', emoji: '🔧' },
      { value: 'Closet', emoji: '👗' },
      { value: 'Storage Room', emoji: '📦' },
      { value: 'Gym', emoji: '🏋️' },
      { value: 'Other Room', emoji: '🏠' },
    ],
    type: 'checkbox',
  },
  {
    id: 'squareFootage',
    text: 'Estimated Square Footage of the space to clean:',
    type: 'slider',
    min: 100,
    max: 5000,
    step: 5,
  },
  {
    id: 'pets',
    text: 'Do you have pets?',
    type: 'yesNo',
  },
  {
    id: 'address',
    text: 'Please provide your address:',
    type: 'address',
  },
  {
    id: 'additionalInfo',
    text: 'Any other information you would like to provide? If not say "No"',
    type: 'text',
  },
  


];

const Booking = () => {
  const [formData, setFormData] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const handleAgree = () => {
    setShowPopup(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'rooms') {
      if (value === 'Entire House') {
        setFormData((prev) => ({
          ...prev,
          [name]: checked ? [value] : [],
        }));
      } else {
        setFormData((prev) => {
          const currentValue = prev[name] || [];
          if (checked) {
            return {
              ...prev,
              [name]: [...currentValue, value].filter((item) => item !== 'Entire House'),
            };
          } else {
            return {
              ...prev,
              [name]: currentValue.filter((item) => item !== value),
            };
          }
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'radio' ? value : value,
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      if (currentQuestion === questions.length - 1) {
        setCompleted(true);
        setShowScheduling(true);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setErrors({});
      }
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    if (question.type === 'radio' || question.type === 'checkbox') {
      if (!formData[question.id] || (Array.isArray(formData[question.id]) && formData[question.id].length === 0)) {
        setErrors({ [question.id]: 'This field is required.' });
        return false;
      }
    } else if ((question.type === 'number' || question.type === 'text') && !formData[question.id]) {
      setErrors({ [question.id]: 'This field is required.' });
      return false;
    } else if (question.type === 'yesNo' && formData[question.id] === undefined) {
      setErrors({ [question.id]: 'This field is required.' });
      return false;
    } else if (question.type === 'address') {
      const addressFields = ['street', 'city', 'state', 'zip'];
      for (const field of addressFields) {
        if (!formData.address || !formData.address[field]) {
          setErrors({ [question.id]: 'All address fields are required.' });
          return false;
        }
      }
    }
    return true;
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <div className="options-container">
              {question.options.map((option) => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={formData[question.id] === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <div className="options-container">
              {question.options.map((option) => (
                <label key={option.value} className="option-label">
                  <input
                    type="checkbox"
                    name={question.id}
                    value={option.value}
                    checked={formData[question.id]?.includes(option.value)}
                    onChange={handleChange}
                    disabled={option.value === 'Entire House' ? false : formData[question.id]?.includes('Entire House')}
                  />
                  {option.value} {option.emoji}
                </label>
              ))}
            </div>
            {formData[question.id]?.includes('Other Room') && (
              <input
                type="text"
                className="text-input"
                name="otherRoom"
                placeholder="Please specify the other room(s)"
                value={formData['otherRoom'] || ''}
                onChange={handleChange}
              />
            )}
          </div>
        );
      case 'slider':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <input
              type="range"
              className="range-slider"
              name={question.id}
              min={question.min}
              max={question.max}
              step={question.step}
              value={formData[question.id] || question.min}
              onChange={handleChange}
            />
            <div className="range-label">{formData[question.id] || question.min} sq ft</div>
          </div>
        );
      case 'number':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <input
              type="number"
              className="text-input"
              name={question.id}
              value={formData[question.id] || ''}
              onChange={handleChange}
            />
          </div>
        );
      case 'text':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <input
              type="text"
              className="text-input"
              name={question.id}
              value={formData[question.id] || ''}
              onChange={handleChange}
              placeholder={question.id === 'zip' ? 'Enter ZIP code' : ''}
            />
          </div>
        );
      case 'yesNo':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <div className="options-container">
              <label className="option-label">
                <input
                  type="radio"
                  name={question.id}
                  value="Yes"
                  checked={formData[question.id] === 'Yes'}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label className="option-label">
                <input
                  type="radio"
                  name={question.id}
                  value="No"
                  checked={formData[question.id] === 'No'}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
            {formData[question.id] === 'Yes' && (
              <input
                type="text"
                className="text-input"
                name="petsDetails"
                placeholder="Please specify your pets"
                value={formData['petsDetails'] || ''}
                onChange={handleChange}
              />
            )}
          </div>
        );
      case 'address':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <input
              type="text"
              className="text-input"
              name="street"
              placeholder="Street Address"
              value={formData.address?.street || ''}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              className="text-input"
              name="city"
              placeholder="City"
              value={formData.address?.city || ''}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              className="text-input"
              name="state"
              placeholder="State"
              value={formData.address?.state || ''}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              className="text-input"
              name="zip"
              placeholder="ZIP Code"
              value={formData.address?.zip || ''}
              onChange={handleAddressChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="booking-form">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Agreement Required</h2>
            <p>By Clicking Agree, you agree to all thex <a href="/info" target="_blank" rel="noopener noreferrer">Terms Of Service</a></p>
            <button onClick={handleAgree}>I Agree</button>
          </div>
        </div>
      )}
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
      {!completed ? (
        <div className="question-container">
          {renderQuestion(questions[currentQuestion])}
          <div className="button-group">
            {currentQuestion > 0 && <button onClick={handlePrevious}>Previous</button>}
            <button onClick={handleNext}>{currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}</button>
          </div>
          {errors[questions[currentQuestion]?.id] && <p className="error">{errors[questions[currentQuestion]?.id]}</p>}
        </div>
      ) : (
        <>
          {showScheduling && <Scheduling />}
          {showPayment && <Payment />}
        </>
      )}
    </div>
  );
};

export default Booking;
