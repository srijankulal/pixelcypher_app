"use client";

import { PropsWithChildren } from "react";

interface BackGroundProps extends PropsWithChildren {
  className?: string;
}

const BackGround: React.FC<BackGroundProps> = ({ children, className }) => {
  return (
    <div className={`flex justify-center items-center min-h-screen w-full p-0 relative ${className || ''}`}>
      {/* Main container - full screen with centering */}
      <div className="pixel-background w-full h-full md:w-4/5 md:h-4/5 border-2 border-green-950 rounded-md bg-[#050511] mx-auto">
        {/* Pixels layer */}
        <div className="pixels-container absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index} 
              className="pixel" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Content layer */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full overflow-y-auto py-4">
          {children}
        </div>
      </div>

      <style jsx>{`
        .pixel-background {
          position: relative;
          overflow: hidden;
          max-width: 1200px; /* Prevent it from being too wide on very large screens */
        }
        
        .pixel {
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: #0F0;
          animation: moveUp linear infinite;
          opacity: 0.5;
          top: 100%;
        }
        
        @keyframes moveUp {
          0% {
            top: 100%;
          }
          100% {
            top: -50px;
          }
        }

        /* Make sure the container is properly centered */
        @media (min-width: 768px) {
          .pixel-background {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default BackGround;