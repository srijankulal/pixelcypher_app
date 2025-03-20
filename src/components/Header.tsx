import Link from "next/link";
import Logo from "@/public/Logo.png"
import Image from "next/image";

export default function Header(){
    return(
        <header className="text-white p-4"> 
        <div className="flex justify-start items-center">
        <Image src={Logo} alt="Logo" className="w-20 h-20" />   
            <h1 className="text-5xl font-bold"><Link href="/">PixelCypher</Link></h1>
            </div>
            <p className="text-2xl text-green-800">Secure text-to-image encryption and decryption</p>
        </header>
    );


}