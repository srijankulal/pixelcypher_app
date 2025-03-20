"use client";

import BackGround from "@/components/BackGround";
import FloatButtons from "@/components/FloatButtons";
import Header from "@/components/Header";
import Upload from "@/components/upload";
import Image from "next/image";
import EnPH from "../../../public/PHpic.png";

import { Button } from 'antd';
import { useState } from "react";
import { toast } from "@/hooks/use-toast";



export default function Encrypt() {
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
    const [text, setText] = useState<string>("");
    const [encryptedImageUrl, setEncryptedImageUrl] = useState<string | null>(null);

    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = true;
          return newLoadings;
        });
    };

// Function to handle copying the image to clipboard
const handleCopyImage = async () => {
    if (!encryptedImageUrl) {
      console.error("No encrypted image to copy");
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
      console.log("Image copied to clipboard");
    } catch (error) {
      console.error("Failed to copy image to clipboard:", error);
      // Fallback for browsers that don't support clipboard.write with images
      alert("Your browser doesn't support copying images to clipboard. Please use the download button instead.");
    }
  };   
  const handleDownloadImage = () => {
    if (!encryptedImageUrl) {
      console.error("No encrypted image to download");
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
    
    console.log("Image download initiated");
  }; 
  const handleEncrypt = async () => {
    try {
        setEncryptedImageUrl(null);
        enterLoading(1);
        if (!imageBuffer) {
            console.error("No image selected");
            return;
        }
        
        const formData = new FormData();
        const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
        formData.append('image', imageBlob, 'image.png');
        formData.append('text', text);
        
        const response = await fetch('/api/Encode', {
            method: 'POST',
            body: formData,
            credentials: 'include'  // Add this line
          });
        if (!response.ok) {
            console.error("Failed to process request");
            return;
        }
        // Parse the response to get the image URL
        const path=await response.json();
        const trimPath = path.EncrpytImagePath.toString().replace(/\\/g, "/").replace(/^.*?public/, '');
        setEncryptedImageUrl(trimPath);
        // Reset loading state
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[1] = false;
            return newLoadings;
        });
        toast({
          title: "Success",
          description: "Encryption successful",
          variant: "default",
        });
        
        console.log("Encryption successful");
    } catch (error) {
        console.error("Encryption failed:", error);
        // Reset loading state
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[1] = false;
            return newLoadings;
        });
    }
};
    
    return (
        <>
            <Header></Header>
            <BackGround>
                <FloatButtons whereAt="encrypt"></FloatButtons>
                <h1 className="text-white p-4 text-4xl font-bold flex justify-center items-center w-full">Encrypt</h1>
                <div className="flex flex-row justify-between p-5 gap-8">
                    
                    <div className="flex flex-col">
                        <Upload onImageUpload={(buffer) => setImageBuffer(buffer)}></Upload>
                        <h1 className="text-white p-3 text-2xl font-bold justify-start">Enter Encrypting Text: </h1>
                        <input 
                            type="text" 
                            className="text-black p-2 text-xl font-bold" 
                            placeholder="Enter the secret Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col p-5 justify-center">
                        <Button
                            type="primary"
                            loading={loadings[2]}
                            onClick={() => {
                                handleEncrypt();
                            }}
                            iconPosition="end"
                            className="text-white p-4 bg-green-600 hover:bg-green-800 transition-colors duration-300 hover:outline hover:shadow-lg" 
                        >
                            Encrypt
                        </Button>
                    </div>
                    
                    <div className="flex flex-col">
                        <h1 className="text-white p-3 text-2xl font-bold">Encrypted Image: </h1>
                        <div className="flex flex-row justify-center items-center border-2 border-gray-950 rounded-lg p-2 m-2 bg-white bg-opacity-20  "> 
                            <Image src={encryptedImageUrl || EnPH} alt="Encrypted Image" className="w-fit h-fit " width={300} height={300}/>
                        </div>
                        <div className="flex flex-row items-center">
                            <div className="flex flex-col pr-4 pl-2">
                                <Button className="text-white text-lg hover:outline bg-green-500 rounded-full"
                                onClick={handleCopyImage}
                                disabled={!encryptedImageUrl}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </Button>
                            </div>
                            
                            <div className="flex flex-col">
                                <Button className="text-white text-lg hover:outline bg-green-500 rounded-full"
                                onClick={handleDownloadImage}
                                disabled={!encryptedImageUrl}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        </div>
                        </div>
                    
            </BackGround>
            </>
    );
}

// The setEncryptedImageUrl state setter is already being used in the component
// No need for additional setter functions
