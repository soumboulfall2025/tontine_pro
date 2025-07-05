import React from "react";

const Spinner = ({ size = 40, color = "#6366f1" }) => (
  <div className="flex items-center justify-center w-full h-full">
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ display: "block" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="31.415, 31.415"
      />
    </svg>
  </div>
);

export default Spinner;
