import React from "react";

const Button = ({ children, className, onClick }) => (
  <button className={`px-4 py-2 rounded-lg shadow-md ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
