"use client";

import BackGround from "@/components/BackGround";
import FloatButtons from "@/components/FloatButtons";
import Header from "@/components/Header";
import Upload from "@/components/upload";
import { toast } from "@/hooks/use-toast";
import { Button } from "antd";
import { useState } from "react";






export default function Decrypt() {
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
    const [text, setText] = useState<string>("");
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

    const handleDecrypt = async () => {
        enterLoading(2);
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
    const formData = new FormData();
        const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
        formData.append('image', imageBlob, 'image.png');
        const response = await fetch("/api/Decode", {
            method: 'POST',
            body: formData,
        });
        if (response.status !== 200) {
            console.error("Failed to decrypt image");
            toast({
                title:"Error",
                description:"Failed to decrypt image",
                variant:"destructive"
            });
            setFalse();
            return;
        }
        const data = await response.json();
        console.log(data);
        setText(data.DecryptedText);
        setFalse();
}
    return(
        <>
         <Header></Header>
         <BackGround>
             <FloatButtons whereAt="decrypt"></FloatButtons>
                            <h1 className="text-white p-4 text-4xl font-bold flex justify-center items-center w-full">Decrypt</h1>
                            <Upload
                                onImageUpload={(buffer) => {
                                setImageBuffer(buffer);
                                }}
                                onImageRemove={() => {
                                // Debug to verify this gets called
                                setImageBuffer(null);
                                setText(""); // This should clear the text
                                }}
                                    ></Upload>
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex flex-col items-center justify-center pt-2">
                                <Button
                                    type="primary"
                                    loading={loadings[2]}
                                    onClick={handleDecrypt}
                                    className="text-white p-2  hover:outline"
                                    >
                                    Decrypt
                                </Button>
                                </div>
                                <h2 className="text-white p-2 text-2xl font-bold">Decrypted Text:</h2>
                                <textarea 
    className="w-3/4 h-1/4 p-2 text-white placeholder-white bg-white bg-opacity-50 rounded-lg" 
    value={text || ''} 
    placeholder="Decrypted text will appear here" 
    readOnly
></textarea>
                                </div>
            </BackGround>
        </>
    )
}