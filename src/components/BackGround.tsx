"use client";

import { useEffect, useRef } from "react";
import { PropsWithChildren } from "react"; 
 
interface BackGroundProps extends PropsWithChildren {
  className?: string;
}

const BackGround: React.FC<BackGroundProps> = ({ children, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundColor = "#050511"; // Grey background color

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      const pixelSize = 20; // Size of each pixel
      const spacing = 44; // Space between pixels
      
      const columns = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);
      
      // Create an array of pixel objects with random positions
      const pixels: Array<{x: number, y: number, prevX: number, prevY: number}> = [];
      const maxPixels = 10; // Just 3 pixels
      
      // Initialize pixels at random positions
      function createRandomPixel() {
        const x = Math.floor(Math.random() * columns);
        const y = Math.floor(Math.random() * rows);
        return {
          x: x,
          y: y,
          prevX: x, // Track previous position to clear
          prevY: y
        };
      }
      
      // Initial creation of pixels
      for (let i = 0; i < maxPixels; i++) {
        pixels.push(createRandomPixel());
      }
      
      // Fill canvas with grey initially
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      function draw() {
        if (!ctx || !canvas) return;
        
        // Clear previous pixel positions with grey
        for (let i = 0; i < pixels.length; i++) {
          const pixel = pixels[i];
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(
            pixel.prevX * spacing, 
            pixel.prevY * spacing, 
            pixelSize, 
            pixelSize
          );
        }
  
        // Draw new pixel positions
        for (let i = 0; i < pixels.length; i++) {
          const pixel = pixels[i];
          
          // Update previous position
          pixel.prevX = pixel.x;
          pixel.prevY = pixel.y;
          
          // Move pixel upward
          if (Math.random() > 0.4) {
            pixel.y--;
          }
  
          // If pixel moves off the top, reset to a random position at the bottom
          if (pixel.y * spacing < 0) {
            pixel.y = rows - 1; // Place at bottom
            pixel.x = Math.floor(Math.random() * columns); // Random horizontal position
          }
          
          // Draw the pixel in new position
          ctx.fillStyle = "#0F0"; // Green color
          ctx.fillRect(
            pixel.x * spacing, 
            pixel.y * spacing, 
            pixelSize, 
            pixelSize
          );
        }
      }
  
      const intervalId = setInterval(draw, 50);
  
      function handleResize() {
        if (!canvas || !ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Refill with grey after resize
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
  
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
        clearInterval(intervalId);
      };
    }, []);
  
    return (
    <div className="flex justify-center p-2 h-screen w-screen relative rounded-sm overflow-hidden ">
      <canvas ref={canvasRef} className="absolute w-3/4 h-3/4  border-2 border-green-950 rounded-md " />
      <div className="relative z-10">
        {children}
      </div>
    </div>
    );
  }

export default BackGround;