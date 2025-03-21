"use client";

import BackGround from "@/components/BackGround";
import FloatButtons from "@/components/FloatButtons";
import Header from "@/components/Header";
import Upload from "@/components/upload";
import Image from "next/image";
import EnPH from "../../../public/PHpic.png";

import { Button } from 'antd';
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function Encrypt() {
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
    const [text, setText] = useState<string>("");
    const [encryptedImageUrl, setEncryptedImageUrl] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if the screen size is mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        // Initial check
        checkIsMobile();
        // Add event listener for window resize
        window.addEventListener('resize', checkIsMobile);
        
        // Cleanup the event listener
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = true;
          return newLoadings;
        });
    };
    // Reset loading state
    const setFalse=()=>{
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[2] = false;
            return newLoadings;
        });
    }
    
    // Function to handle copying the image to clipboard
    const handleCopyImage = async () => {
        if (!encryptedImageUrl) {
          console.error("Button works ,but no encrypted image to copy");
          return;
        }
      
        try {
          // Fetch the image as a blob from the URL
          const response = await fetch(encryptedImageUrl);
          const blob = await response.blob();
          
          // Create a ClipboardItem object
          const item = new ClipboardItem({
            [blob.type]: blob
          });
          
          // Try to write to the clipboard
          await navigator.clipboard.write([item]);
          toast({
            title: "Copied",
            description: "Image copied to clipboard",
            variant: "default",
            className: "bg-green-500 text-white",
            duration: 5000,
          });
          console.log("Image copied to clipboard");
        } catch (error) {
          console.error("Failed to copy image to clipboard:", error);
          // Fallback for browsers that don't support clipboard.write with images
          alert("Your browser doesn't support copying images to clipboard. Please use the download button instead.");
        }
    };   
    
    const handleDownloadImage = () => {
        if (!encryptedImageUrl) {
          console.error("Suiiiiiiii");
          return;
        }
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = encryptedImageUrl;
        link.download = 'encrypted-image.png'; // Set a filename
        
        // Append to the document, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Success",
            description: "Image download initiated",
            variant: "default",
            className: "bg-green-500 text-white",
            duration: 5000,
        });
        console.log("Image download initiated");
    }; 
    const handleApiError = (status: number) => {
        const errorMessages: Record<number, {title: string, description: string}> = {
            400: {title: "Error", description: "No image file and text provided"},
            401: {title: "Error", description: "No image file provided"},
            402: {title: "Error", description: "No text provided"},
            500: {title: "Server Error", description: "An unexpected error occurred"},
            502: {title: "Gateway Error", description: "Unable to reach the encryption service"},
            510: {title: "Error", description: "Processing error"}
        };
        
        const message = errorMessages[status] || 
            {title: "Error", description: `Unexpected error (${status})`};
        
        toast({
            title: message.title,
            description: message.description,
            variant: "destructive"
        });
        setFalse();
    }
    const handleEncrypt = async () => {
        try {
            enterLoading(2);
            if(!imageBuffer && (!text || !text.trim())){
                toast({
                    title:"Error",
                    description:"No image file and text provided",
                    variant:"destructive"
                });
                setFalse();
                return;
            }
            if (!imageBuffer) {
                console.error("No image selected");
                toast({
                    title:"Error",
                    description:"No image is selected",
                    variant:"destructive"
                });
                setFalse();
                return;
            }
            if(!text){
                toast({
                    title:"Error",
                    description:"No text is entered",
                    variant:"destructive"
                })
                setFalse();
                return;
            }
            
            const formData = new FormData();
            const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
            formData.append('image', imageBlob, 'image.png');
            formData.append('text', text);
            
            const response = await fetch("/api/Encode", {
                method: 'POST',
                body: formData,
            });
            if (response.status !== 200) {
                if(response.status === 502){
                    const errorData = await response.json();
                    toast({
                        title: "Error",
                        description: errorData.error || "Gateway Error",
                        variant: "destructive"
                    });
                    setFalse();
                    return;
                }
                handleApiError(response.status);
                return;
            }
            // Parse the response to get the base64 image data
            const result = await response.json();
            console.log("RESULT",result);
            // Set the encrypted image URL using the base64 data
            console.log("Encrypted Image URL",result.EncrpytImagePath);
            setEncryptedImageUrl(result.EncrpytImagePath);
            setFalse();
            toast({
              title: "Success",
              description: "Encryption successful",
              variant: "default",
              className: "bg-green-500 text-white",
              duration: 5000,
            });
            console.log("Encryption successful");
        } catch (error) {
            console.error("Encryption failed:", error);
            // Reset loading state
            setFalse();
        }
        finally {
            setText("");
        }
    };

    return (
        <>
            <Header></Header>
            <BackGround className="flex flex-col justify-center items-center min-h-screen w-full">
                
                <h1 className="text-white p-4 text-4xl font-bold flex justify-center items-center w-full ">Encrypt</h1>
                
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between p-3 w-full max-w-6xl`}>
                   
                    <div className="flex flex-col w-full md:w-auto">
                        <Upload 
                        onImageUpload={(buffer: ArrayBuffer | null) => {
                            setImageBuffer(buffer);
                            setEncryptedImageUrl(null);
                        }}
                        onImageRemove={() => {
                            setEncryptedImageUrl(null);
                            setText("");
                        }}
                        ></Upload>
                        <h1 className="text-white p-2 md:p-3 text-xl md:text-2xl font-bold justify-start">Enter Encrypting Text: </h1>
                        <input 
                            type="text" 
                            className="text-black p-2 text-lg md:text-xl font-bold w-full" 
                            placeholder="Enter the secret Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col justify-center p-2 md:p-5 w-full md:w-auto">
                        <Button
                            type="primary"
                            loading={loadings[2]}
                            onClick={() => {
                                handleEncrypt();
                            }}
                            iconPosition="end"
                            className="text-white p-3 md:p-4 bg-green-600 hover:bg-green-800 transition-colors duration-300 hover:outline hover:shadow-lg" 
                        >
                            Encrypt
                        </Button>
                    </div>
                    
                    <div className="flex flex-col w-full md:w-auto items-center md:items-start">
                        <h1 className="text-white p-2 md:p-3 text-xl md:text-2xl font-bold">Encrypted Image: </h1>
                        <div className="flex justify-center items-center border-2 border-gray-950 rounded-lg bg-white bg-opacity-20 relative h-48 w-48 md:h-64 md:w-64">
                            <Image 
                                src={encryptedImageUrl || EnPH} 
                                alt="Encrypted Image" 
                                fill 
                                style={{ objectFit: 'contain' }}
                                className="p-2"
                            />
                        </div>
                        <div className="flex flex-row items-center justify-center md:justify-start pt-2">
                            <div className="flex flex-col pr-4 pl-2">
                                <Button className={`text-white text-lg bg-green-500 rounded-full ${!encryptedImageUrl ? 'opacity-50 cursor-not-allowed ' : 'hover:outline'}`}
                                onClick={handleCopyImage}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </Button>
                                
                            </div>
                            
                            <div className="flex flex-col">
                                <Button className={`text-white text-lg bg-green-500 rounded-full ${!encryptedImageUrl ? 'opacity-50 cursor-not-allowed ' : 'hover:outline'}`}
                                onClick={handleDownloadImage}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <FloatButtons whereAt="encrypt"></FloatButtons>
            </BackGround>
        </>
    );
}
