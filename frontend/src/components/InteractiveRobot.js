import React from 'react';

const InteractiveRobot = () => {
  return (
    <div className="robot-svg-container">
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="#ff5e3a"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Glow effect definitions */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Head */}
        <rect x="75" y="40" width="50" height="40" rx="4" fill="#1e293b" filter="url(#glow)" />
        {/* Antenna */}
        <line x1="100" y1="20" x2="100" y2="40" />
        <circle cx="100" cy="18" r="4" fill="#ff5e3a" filter="url(#glow)" />

        {/* Eyes */}
        <circle className="robot-eye" cx="88" cy="55" r="4" fill="#ff5e3a" stroke="none" />
        <circle className="robot-eye" cx="112" cy="55" r="4" fill="#ff5e3a" stroke="none" />

        {/* Mouth/Smile */}
        <path d="M 85 65 Q 100 75 115 65" />

        {/* Neck */}
        <rect x="90" y="80" width="20" height="15" fill="#1e293b" />

        {/* Body */}
        <rect x="55" y="95" width="90" height="60" rx="6" fill="#1e293b" filter="url(#glow)" />
        
        {/* Body details / vents */}
        <line x1="65" y1="110" x2="135" y2="110" stroke="#334155" strokeWidth="2" />
        <line x1="65" y1="125" x2="135" y2="125" stroke="#334155" strokeWidth="2" />
        <line x1="65" y1="140" x2="135" y2="140" stroke="#334155" strokeWidth="2" />

        {/* Left Arm */}
        <rect className="robot-arm" x="30" y="95" width="15" height="40" rx="3" fill="#1e293b" filter="url(#glow)" />
        {/* Right Arm */}
        <rect className="robot-arm" x="155" y="95" width="15" height="40" rx="3" fill="#1e293b" filter="url(#glow)" />

        {/* Base/Wheels */}
        <rect x="50" y="155" width="100" height="10" rx="5" fill="#1e293b" filter="url(#glow)" />
        <circle cx="65" cy="165" r="6" fill="#ff5e3a" />
        <circle cx="100" cy="165" r="6" fill="#ff5e3a" />
        <circle cx="135" cy="165" r="6" fill="#ff5e3a" />

        {/* Wire decoration */}
        <path d="M 125 45 Q 140 30 145 55" stroke="#ff5e3a" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
};

export default InteractiveRobot;
