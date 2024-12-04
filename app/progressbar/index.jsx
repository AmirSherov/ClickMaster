import React, { useMemo } from 'react';
import './progressbar.scss';

const ProgressBar = React.memo(({ value = 0, max = 100, rankName = '' }) => {
  const { progress, percentage } = useMemo(() => {
    const validValue = Math.min(Math.max(value, 0), max);
    return {
      progress: validValue,
      percentage: (validValue / max) * 100
    };
  }, [value, max]);

  const formatNumber = useMemo(() => {
    return new Intl.NumberFormat('ru-RU').format;
  }, []);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span>До ранга: {rankName}</span>
      </div>
      <div
        className="progress-bar-fill"
        style={{ 
          width: `${percentage}%`,
          transition: 'width 0.3s ease-in-out'
        }}
      ></div>
      <span className="progress-bar-label">
        {`${formatNumber(progress)} / ${formatNumber(max)}`}
      </span>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;