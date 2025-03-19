"use client";

import BackGround from "@/components/BackGround";
import FloatButtons from "@/components/FloatButtons";
import Header from "@/components/Header";
import Upload from "@/components/upload";
import Head from "next/head";
import Image from "next/image";
import EnPH from "../../../public/EncrpytPH.png";
import { Button } from 'antd';
import { useState } from "react";

export default function Encrypt() {
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = true;
          return newLoadings;
        });
    };
    return (
        <>
         <Header></Header>
    <BackGround >
        <FloatButtons whereAt="encrypt"></FloatButtons>
        <h1 className="text-white p-4 text-4xl font-bold flex justify-center items-center w-full">Encrypt</h1>
        <div className="flex flex-row justify-between p-5 gap-8">
            
            <div className="flex flex-col">
                <Upload></Upload>
                <h1 className="text-white p-3 text-2xl font-bold justify-start">Enter Encrypting Text: </h1>
                <input type="text" className="text-black p-2 text-xl font-bold" placeholder="Enter the secret Text"></input>
            </div>
            
            <div className="flex flex-col p-5 justify-center">
                <Button
                    type="primary"
                    loading={loadings[2]}
                    onClick={() => enterLoading(2)}
                    iconPosition="end"
                    className="text-white p-4 bg-green-600 hover:bg-green-800 transition-colors duration-300 hover:outline hover:shadow-lg" 
                >
                    Encrypt
                </Button>
            </div>
            
            <div className="flex flex-col">
                <h1 className="text-white p-3 text-2xl font-bold">Encrypted Image: </h1>
                <div className="flex flex-row justify-center items-center border-2 border-gray-950 rounded-lg p-2 m-2 bg-white bg-opacity-20"> 
                    <Image src={EnPH} alt="Encrypted Image" className="w-3/4 h-3/4" />
                </div>
                <div className="flex flex-row items-center">
                    <div className="flex flex-col pr-4 pl-2">
                        <Button className="text-white text-lg hover:outline bg-green-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </Button>
                    </div>
                    <div className="flex flex-col">
                        <Button className="text-white text-lg hover:outline bg-green-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </Button>
                    </div>
                    </div>
                </div>
            </div>
    </BackGround>
        </>
    )};