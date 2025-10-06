import React from 'react';
import { FaBookMedical } from 'react-icons/fa';

const Logo = ({ size = 'default', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg`}>
        <FaBookMedical className="text-white text-lg" />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent ${textSizes[size]}`}>
          MedBook
        </span>
      )}
    </div>
  );
};

export default Logo;