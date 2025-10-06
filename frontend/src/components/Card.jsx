import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-2xl shadow-md transition-all duration-200";
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1" : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
