"use client";
import Dragger from "antd/es/upload/Dragger";
import { UploadProps } from "antd";
import UploadPic from "../../public/Image upload-bro.svg";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"

type UpProps = {
    onImageUpload?: (buffer: ArrayBuffer) => void;
    setEncryptedImageUrl?: (url: string | null) => void;
    onImageRemove?: () => void;  // Add this prop
};

export default function Upload({ onImageUpload, setEncryptedImageUrl, onImageRemove }: UpProps) {
        const [imageUrl, setImageUrl] = useState<string | null>(null);
        const { toast } = useToast();

        const props: UploadProps = {
                name: 'file',
                multiple: false,
               
                beforeUpload: (file) => {
                        
                        const isImage = file.type.startsWith('image/') && file.type !== 'image/gif';
                        if (!isImage) {
                                toast({
                                        variant: "destructive",
                                        title: "Upload Error",
                                        description: "You can only upload image files!",
                                });
                                return false;
                        }
                        
                        const isLt10M = file.size / 1024 / 1024 < 10;
                        if (!isLt10M) {
                                toast({
                                        variant: "destructive",
                                        title: "Upload Error",
                                        description: "Image must be smaller than 10MB!",
                                });
                                return false;
                        }
                        
                        // Create a file reader for URL display
                        const urlReader = new FileReader();
                        urlReader.onload = () => {
                                setImageUrl(urlReader.result as string);
                        };
                        urlReader.readAsDataURL(file);
                        
                        // Create a file reader for buffer data
                        if (onImageUpload) {
                                const bufferReader = new FileReader();
                                bufferReader.onload = () => {
                                        if (bufferReader.result instanceof ArrayBuffer) {
                                                onImageUpload(bufferReader.result);
                                        }
                                };
                                bufferReader.readAsArrayBuffer(file);
                        }
                        
                        return false;
                },
                onChange(info) {
                        const { status } = info.file;
                        if (status !== 'uploading') {
                                console.log(info.file, info.fileList);
                        }
                },
                onDrop(e) {
                        console.log('Dropped files', e.dataTransfer.files);
                },
                showUploadList: false, // Hide the default upload list
        };

        const handleReset = async() => {
            setImageUrl(null);
            if (onImageUpload) {
                onImageUpload(new ArrayBuffer(0));
                // Send empty buffer when reset
                toast({
                    title: "Image Reset",
                    description: "The uploaded image has been removed.",
                });
            }
            
            // Call onImageRemove if provided
            if (onImageRemove) {
                onImageRemove();
            }
            
            // Reset encrypted image URL if setEncryptedImageUrl is provided
            if (setEncryptedImageUrl) {
                setEncryptedImageUrl(null);
            }
        };

        return (    
                <>
                <div className="flex flex-col items-center justify-center">
                        <h1 className="text-white p-2 text-4xl font-bold">Upload</h1>
                        
                        {!imageUrl ? (
                                <>
                                <Dragger {...props} className="w-3/4 h-3/4">
                                <div className="flex flex-col items-center justify-center">
                                        <div className="flex flex-col items-center justify-center">
                                                <Image src={UploadPic} alt="upload" className="w-3/4 h-3/4" />
                                        
                                        </div>
                                        
                                        <p className="text-white p-2">Click or drag image here. Max size: 10MB.</p>
                                </div>
                                </Dragger>
                        </>
                        ) : (
                                <div className="relative">
                                    <button 
                                        onClick={handleReset}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                        aria-label="Remove image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </button>
                                    <img 
                                        src={imageUrl} 
                                        alt="Uploaded image" 
                                        className="max-w-full max-h-[200px] rounded-lg"
                                    />
                                </div>
                        )}
                </div>
                </>
        );
}