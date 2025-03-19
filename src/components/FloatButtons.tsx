"use client";

import { PropsWithChildren } from "react";

interface BackGroundProps extends PropsWithChildren {
    whereAt?: string;
}

export default function FloatButtons({ whereAt = "" }: BackGroundProps) {
    // Function to determine button class based on current page
    const getButtonClass = (page: string) => {
        const baseClass = "text-white font-bold py-2 px-4 rounded-full";
        
        if (whereAt === page) {
            // Highlighted state - darker shade and border
            switch (page) {
                case "home": return `bg-green-800 border-2 border-white ${baseClass}`;
                case "encrypt": return `bg-blue-700 border-2 border-white ${baseClass}`;
                case "decrypt": return `bg-red-700 border-2 border-white ${baseClass}`;
                default: return `${baseClass}`;
            }
        } else {
            // Normal state
            switch (page) {
                case "home": return `bg-green-600 hover:bg-green-800 ${baseClass}`;
                case "encrypt": return `bg-blue-500 hover:bg-blue-700 ${baseClass}`;
                case "decrypt": return `bg-red-500 hover:bg-red-700 ${baseClass}`;
                default: return `${baseClass}`;
            }
        }
    };

    return (
        <>
            <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4 flex flex-col gap-2">
                <button className={getButtonClass("home")} onClick={() => window.location.href = "/"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>    Home 
                </button>

                <button className={getButtonClass("encrypt")} onClick={() => window.location.href = "/encrypt"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Encrypt
                </button>  
                
                <button className={getButtonClass("decrypt")} onClick={() => window.location.href = "/decrypt"}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Decrypt
                </button>
            </div>
        </>
    );
}