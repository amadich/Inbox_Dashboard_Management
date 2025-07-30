"use client";

import { useEffect, useState } from "react";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation"; // For newer versions of Next.js
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

export default function Home() {
  const [countdown, setCountdown] = useState(10); // Start countdown from 10 seconds
  const [isClient, setIsClient] = useState(false); // Track client-side rendering state
  const router = useRouter(); // Router hook for client-side navigation

  const userInfo = TokenInfoUser();
  const hasAccess = userInfo?.role === "MANAGER" || userInfo?.role === "ADMIN" 
        ? true 
        : false
    

  useEffect(() => {
    // Mark as client-side after initial render
    setIsClient(true);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // When countdown hits 0, perform the redirect
    if (countdown === 0) {
      clearInterval(interval);
      hasAccess ? router.push("/Dashboard") : router.push("/Projects"); // Redirect to dashboard page
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
        <Image src={SotetelLogo} width={250} height={250} alt="Sotetel Logo" />
        <progress className="progress progress-accent w-96 mt-10"></progress>

        <div className="mt-4 text-center">
          {/* Show the same message, but when countdown reaches 5, it will indicate the redirect is coming */}
          <p>
            {countdown <= 5
              ? `سيتم توجيهك إلى لوحة القيادة خلال: ${countdown} ثانية` // Translated 'You will be redirected to the dashboard in' to Arabic
              : null} {/* Regular countdown message */}
          </p>
        </div>
      </div>
    </>
  );
}
