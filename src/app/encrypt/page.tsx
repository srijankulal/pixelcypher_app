"use client";

import BackGround from "@/components/BackGround";
import FloatButtons from "@/components/FloatButtons";
import Header from "@/components/Header";
import Upload from "@/components/upload";
import Image from "next/image";
import EnPH from "../../../public/PHpic.png";
import { Button, Spin } from 'antd';
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import React from "react";
import { LoadingOutlined } from '@ant-design/icons';

export default function Encrypt() {
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
    const [text, setText] = useState<string>("");
    const [encryptedImageUrl, setEncryptedImageUrl] = useState<string | null>(null);
    const [load, setLoadingState] = React.useState<boolean>(false);

    const [isMobile, setIsMobile] = useState(false);
    const [blobId, setBlobId] = useState<string | null>(null);

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
    
    const handleDownloadImage = async() => {
        if (!encryptedImageUrl) {
          console.error("Suiiiiiiii");
          return;
        }
        // Fetch the image as a blob
        const response = await fetch(encryptedImageUrl);
        const blob = await response.blob();
        
        // Create an object URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'encrypted-image.png'; // Set a filename

        // Append to the document, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Release the object URL
        URL.revokeObjectURL(blobUrl);
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
        setLoadingState(false);
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
                setLoadingState(false);
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
                setLoadingState(false);
                return;
            }
            if(!text){
                toast({
                    title:"Error",
                    description:"No text is entered",
                    variant:"destructive"
                })
                setFalse();
                setLoadingState(false);
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
                    setLoadingState(false);
                    return;
                }
                handleApiError(response.status);
                return;
            }
            // Parse the response to get the base64 image data
            const result = await response.json();
            // console.log("RESULT",result);

            // console.log("Encrypted Image URL",result.EncrpytImagePath);
            setEncryptedImageUrl(result.EncrpytImagePath);
            if (result.blobId) {
                setBlobId(result.blobId);
            }
            setFalse();
            toast({
              title: "Success",
              description: "Encryption successful",
              variant: "default",
              className: "bg-green-500 text-white",
              duration: 5000,
            });
            setLoadingState(false);
            console.log("Encryption successful");
        } catch (error) {
            console.error("Encryption failed:", error);
            setLoadingState(false);
            // Reset loading state
            setFalse();
        }
        finally {
            setText("");
        }
    };

    async function removeBlob() {
        if (!blobId) {
            return; // No blob to remove
        }
        
        try {
            // Call your API to delete the blob
            const response = await fetch(`/api/upload?id=${blobId}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
               console.log("Blob deleted successfully");
                setBlobId(null);
            } else {
                console.error("Failed to delete blob:", await response.text());
            }
        } catch (error) {
            console.error("Error deleting blob:", error);
        }
    }

    return (
        <>
            <Header></Header>
            <BackGround className="flex flex-col justify-center items-center min-h-screen w-full px-4 py-8">
                <div className="flex flex-col items-center justify-center w-full">
                    <h1 className="text-white p-2 text-2xl md:text-4xl font-bold text-center mb-4">Encrypt</h1>
                    
                    {/* Main content container with improved responsive layout */}
                    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl justify-center items-center">
                        
                        {/* Upload and Text Input Section */}
                        <div className="flex flex-col w-full md:w-1/3 max-w-xs md:max-w-full">
                            <Upload 
                                onImageUpload={(buffer: ArrayBuffer | null) => {
                                    setImageBuffer(buffer);
                                    setEncryptedImageUrl(null);
                                }}
                                onImageRemove={() => {
                                    setEncryptedImageUrl(null);
                                    setText("");
                                    removeBlob();
                                }}
                            />
                            <h1 className="text-white p-2 text-xl font-bold mt-4">Enter Encrypting Text: </h1>
                            <input 
                                type="text" 
                                className="text-black p-2 text-lg font-bold w-full rounded" 
                                placeholder="Enter the secret Text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Button Section - Improved mobile positioning */}
                        <div className="flex flex-col justify-center items-center w-full md:w-1/6 my-4">
                            <Button
                                type="primary"
                                loading={loadings[2]}
                                onClick={() => {
                                    setLoadingState(true);
                                    handleEncrypt();
                                }}
                                className="text-white py-2 px-6 bg-green-600 hover:bg-green-800 transition-colors duration-300 hover:shadow-lg w-48 md:w-auto"
                            >
                                Encrypt
                            </Button>
                        </div>
                        
                        {/* Result Section - Improved for mobile */}
                        <div className="flex flex-col w-full md:w-1/3 max-w-xs md:max-w-full items-center">
                            <h1 className="text-white p-2 text-xl font-bold self-center mb-2">Encrypted Image: </h1>
                            
                            {/* Image container - made consistent size */}
                            <div className="flex justify-center items-center border-2 border-gray-950 rounded-lg bg-white bg-opacity-20 relative h-48 w-48 mb-4">
                                {load ? (
                                    <Spin 
                                        spinning={load} 
                                        indicator={<LoadingOutlined style={{ fontSize: 34, color: '#4ade80' }} spin />} 
                                        size="large" 
                                    >
                                        <Image 
                                            src={EnPH} 
                                            alt="Encrypted Image" 
                                            fill 
                                            style={{ objectFit: 'contain' }}
                                            className="p-2"
                                        />
                                    </Spin>
                                ) : (
                                    <Image 
                                        src={encryptedImageUrl || EnPH} 
                                        alt="Encrypted Image" 
                                        fill 
                                        style={{ objectFit: 'contain' }}
                                        className="p-2"
                                    />
                                )}
                            </div>
                            
                            {/* Buttons container - Improved layout for mobile */}
                            <div className="flex flex-row justify-center gap-4 mt-2 w-full">
                                <Button 
                                    className={`text-white py-2 px-4 bg-green-500 rounded-md ${!encryptedImageUrl ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                                    onClick={handleCopyImage}
                                    
                                >
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </div>
                                </Button>
                                <Button 
                                    className={`text-white py-2 px-4 bg-green-500 rounded-md ${!encryptedImageUrl ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                                    onClick={handleDownloadImage}
                                    
                                >
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download
                                    </div>
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