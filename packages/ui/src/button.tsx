"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;  // ✅ Make onClick optional
  disabled?: boolean;    // ✅ Added disabled functionality
}

export const Button = ({ onClick, children, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}  // ✅ Button will be disabled if true
      className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
      focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}  // ✅ Styles for disabled state
    >
      {children}
    </button>
  );
};
// 