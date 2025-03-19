
"use client";
import BackGround from "@/components/BackGround";
import FloatButtons from "@/components/FloatButtons";
import Header from "@/components/Header";
import Image from "next/image";
import home from "../../public/home.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (

  <div className=" bg-black">  
    <Header></Header>
    <BackGround >
    <FloatButtons whereAt="home"></FloatButtons>
    <div className="flex flex-col items-center">
      <h3 className="text-white p-3 text-xl">Encrypt Your Messages as Images</h3>
      <Image src={home} alt="home" className="w-1/4 h-1/4" />
      <p className="text-white p-2 text-base sm:text-lg md:text-xl  text-center mx-auto">PixelCypher is a secure text-to-image encryption and decryption tool.</p>  
   <Link href="/encrypt">
    <Button className="text-white p-2 text-lg hover:outline" effect="shine">
Start Encrypting
    </Button>
   </Link>

  {/* Center heading */}
  <h2 className="text-white p-2 text-2xl font-bold">What can app do?</h2>
  
  {/* Three columns with the middle column as separator */}
  <div className="flex flex-row justify-between items-center border-2 border-gray-950 rounded-lg p-2 m-2 bg-white bg-opacity-20 w-4/5 ">
    {/* First column - Encrypt */}
    <div className="flex flex-col items-center p-2 w-1/3">
      <h2 className="text-white p-2 text-xl font-semibold">Encrypt</h2>
      <p className="text-white text-lg text-center">Encrypt your secret messages into images</p>
      <div className="mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 00-8 0v4h8V7z" />
        </svg>
      </div>
    </div>
    
    {/* Middle column - Separator */}
    <div className="flex flex-col items-center justify-center p-2 w-1/3">
      <div className="relative">
        <div className="h-0.5 bg-green-500 w-32"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
      </div>
      <p className="text-white text-lg mt-4 text-center">Two-way conversion</p>
    </div>
    
    {/* Third column - Decrypt */}
    <div className="flex flex-col items-center p-2 w-1/3">
      <h2 className="text-white p-2 text-xl font-semibold">Decrypt</h2>
      <p className="text-white text-lg text-center">Extract hidden messages from images</p>
      <div className="mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  </div>
</div>
      </BackGround>
    </div>


  );
}
