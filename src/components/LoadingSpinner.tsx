import React from 'react';
import BotIcon from '../assets/bot_icon.svg';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <img src={BotIcon} alt="Loading..." className="loading-icon" />
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default LoadingSpinner; 