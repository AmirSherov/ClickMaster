import React from 'react';
import './progressbar.scss'; 

const ProgressBar = ({ value, max }) => {
  const progress = Math.min(Math.max(value, 0), max);
  const percentage = (progress / max) * 100;

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="progress-bar-label">{`${progress} / ${max}`}</span>
    </div>
  );
};

export default ProgressBar;
