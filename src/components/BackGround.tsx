"use client";

import { PropsWithChildren } from "react";

interface BackGroundProps extends PropsWithChildren {
  className?: string;
}

const BackGround: React.FC<BackGroundProps> = ({ children, className }) => {
  return (
    <div className="flex justify-center p-2 h-screen w-screen relative rounded-sm overflow-hidden">
      <div className="pixel-background absolute w-3/4 h-3/4 border-2 border-green-950 rounded-md bg-[#050511]">
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {children}
        </div>
      </div>

      <style jsx>{`
        .pixel-background {
          position: relative;
          overflow: hidden;
        }
        
        .pixel {
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: #0F0;
          animation: moveUp linear infinite;
          opacity: 0.5;
        }
        
        @keyframes moveUp {
          0% {
            top: 100%;
          }
          100% {
            top: -50px;
          }
        }
      `}</style>
    </div>
  );
};

export default BackGround;
