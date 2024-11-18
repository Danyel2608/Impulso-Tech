import React from 'react';
import logo from "./logo.svg";
import "./LoadingIndicator.css"
const LoadingIndicator = () => {
  return (
    <div className="loading">
      <img src={logo} alt="logo" className='loading-logo' />
    </div>

  );
}

export default LoadingIndicator;

