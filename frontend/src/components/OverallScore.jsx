import React from 'react';

const OverallScore = ({ score, label }) => {
  const circumference = 2 * Math.PI * 55;
  const offset = circumference - ((score || 0) / 100) * circumference;
  const scoreColor = label === 'Success' ? '#22c55e' : '#ef4444';

  return (
    <div className="overall-score-container">
      <svg className="score-circle" width="160" height="160" viewBox="0 0 160 160">
        <circle className="score-circle-bg" cx="80" cy="80" r="55" />
        <circle
          className="score-circle-fg"
          cx="80"
          cy="80"
          r="55"
          style={{ 
            stroke: scoreColor,
            strokeDasharray: circumference, 
            strokeDashoffset: offset 
          }}
        />
      </svg>
      <div className="score-text-content">
        <div className="score-probability" style={{ color: scoreColor }}>
          {score}<span>%</span>
        </div>
        <div className="score-label">Success Probability</div>
      </div>
    </div>
  );
};

export default OverallScore;

