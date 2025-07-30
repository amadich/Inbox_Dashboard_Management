"use client";

import { useEffect, useState } from "react";
import SotetelLogo from "@/assets/images/sotetel_loading_logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation"; // For newer versions of Next.js

interface SorryShowProps {
  msg: string;
}

export default function SorryShow({ msg }: SorryShowProps) {
  const [countdown, setCountdown] = useState(5); // Start countdown from 5 seconds
  const [isClient, setIsClient] = useState(false); // Track client-side rendering state
  const router = useRouter(); // Router hook for client-side navigation

  useEffect(() => {
    // Mark as client-side after initial render
    setIsClient(true);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // When countdown hits 0, perform the redirect
    if (countdown === 0) {
      clearInterval(interval);
      router.back();

      
    }

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [countdown, router]);

  // Render nothing until the component is mounted in the client
  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-32">
        <Image src={SotetelLogo} width={250} height={250} alt="شعار سوتيتل" className="h-auto w-auto" draggable={false} unoptimized />
        <span className="loading loading-infinity loading-xl mt-5 pl-10 ml-8 text-blue-500"></span>

        <div className="mt-4 text-center uppercase">
            <h1 className="text-xl font-semibold pl-10 text-blue-500">{msg}...</h1>
          {/* Show the same message, but when countdown reaches 5, it will indicate the redirect is coming */}
          <p>
            {countdown <= 5
              ? `سيتم توجيهك إلى لوحة القيادة خلال: ${countdown} ثواني` // Message when countdown is 5 or less
              : `جاري التحميل وجمع جميع البيانات. يرجى الانتظار لحظة.`} {/* Regular countdown message */}
          </p>
        </div>
      </div>
    </>
  );
}
