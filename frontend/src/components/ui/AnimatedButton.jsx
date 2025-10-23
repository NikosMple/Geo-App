import React from "react";

const AnimatedButton = ({ text = "Explore Interactive Map", onClick }) => {
  return (
    <button className="animated-button" onClick={onClick}>
      <svg
        viewBox="0 0 24 24"
        className="arr-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>
      <span className="text">{text}</span>

      <span className="circle"></span>
      <svg
        viewBox="0 0 24 24"
        className="arr-1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>

      <style jsx>{`
        .animated-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          border: 1px solid;
          border-color: rgba(75, 135, 142, 0.3);
          font-size: 18px;
          background-color: rgba(31, 53, 66, 0.6);
          border-radius: 100px;
          font-weight: 600;
          color: #e0e7ed;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animated-button svg {
          position: absolute;
          width: 24px;
          fill: #e0e7ed;
          z-index: 9;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animated-button .arr-1 {
          right: 16px;
        }
        .animated-button .arr-2 {
          left: -25%;
        }
        .animated-button .circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background-color: rgba(75, 135, 142, 0.4);
          border-radius: 50%;
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animated-button .text {
          position: relative;
          z-index: 1;
          transform: translateX(-12px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animated-button .icon {
          position: relative;
          z-index: 1;
          opacity: 0.8;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animated-button:hover {
          background-color: rgba(42, 70, 85, 0.8);
          box-shadow: 0 4px 12px rgba(75, 135, 142, 0.3);
          border-color: rgba(75, 135, 142, 0.5);
          border-radius: 12px;
        }
        .animated-button:hover .arr-1 {
          right: -25%;
        }
        .animated-button:hover .arr-2 {
          left: 16px;
        }
        .animated-button:hover .text {
          transform: translateX(12px);
        }
        .animated-button:hover .icon {
          transform: translateX(12px);
        }
        .animated-button:hover svg {
          fill: #ffffff;
        }
        .animated-button:active {
          scale: 0.95;
          box-shadow: 0 0 0 4px rgba(75, 135, 142, 0.2);
        }
        .animated-button:hover .circle {
          width: 220px;
          height: 220px;
          opacity: 1;
        }
      `}</style>
    </button>
  );
};

export default AnimatedButton;