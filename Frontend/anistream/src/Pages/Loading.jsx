import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-gray-900">
      {/* Left Half - Slides up from bottom */}
      <div 
        className="absolute left-0 -top-4 w-[52%] h-[110%] transform translate-y-full animate-slide-up-exit z-[10000]" 
        style={{
          clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
          backgroundImage: 'url("./src/Assets/17643.jpg")',
          backgroundSize: '192% 100%',
          backgroundPosition: '0% 0%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
      </div>

      {/* Right Half - Slides down from top */}
      <div 
        className="absolute right-0 -top-4 w-[52%] h-[110%] transform -translate-y-full animate-slide-down-exit z-[10000]" 
        style={{
          clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
          backgroundImage: 'url("./src/Assets/17643.jpg")',
          backgroundSize: '192% 100%',
          backgroundPosition: '100% 0%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
      </div>

      {/* Loading Content */}
      <div className="absolute inset-0 flex items-center justify-center z-[10001]">
        <span className="loader loader-delayed loader-fade-out"></span>
      </div>
    </div>
  );
};

export default Loading;