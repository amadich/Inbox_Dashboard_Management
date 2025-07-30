"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import { useRouter } from "next/navigation"; // For newer versions of Next.js

export default function NotFound() {
  const [countdown, setCountdown] = useState(10); // Start countdown from 10 seconds
  const [isRedirecting, setIsRedirecting] = useState(false); // Track if redirect message should be shown
  const [isClient, setIsClient] = useState(false); // To track if we're on the client side
  const router = useRouter(); // Router hook for client-side navigation

  useEffect(() => {
    // This ensures that the countdown runs only after the component is mounted on the client
    setIsClient(true);

    // Countdown logic
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRedirecting(true); // Show redirect message when countdown reaches 0
          setTimeout(() => {
            router.push("/"); // Redirect to home after countdown ends
          }, 2000); // Wait 2 seconds before redirecting to the dashboard
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [router]);

  // Only render after the client-side has mounted
  if (!isClient) {
    return null; // Do not render anything server-side
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="text-center max-w-lg px-6 py-8 bg-white rounded-lg shadow-lg">
        <Image src={SotetelLogo} alt="Sotetel Logo" width={100} height={100} />
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-6">
          عذرًا، الصفحة التي تبحث عنها غير موجودة. قد تكون قد تم نقلها أو حذفها.
        </p>

        {/* Message shown when countdown reaches 5 or less */}
        {countdown <= 5 && !isRedirecting && (
          <p className="text-gray-600 mt-4">
            سيتم توجيهك إلى لوحة القيادة خلال: {countdown} ثانية
          </p>
        )}

        {/* Redirect message after countdown */}
        {isRedirecting && (
          <p className="text-green-500 mt-4">جاري التوجيه إلى لوحة القيادة...</p>
        )}

        <Link href="/" passHref>
          <button className="btn btn-primary text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg py-2 px-4 mt-6">
            العودة إلى لوحة القيادة
          </button>
        </Link>
      </div>
    </div>
  );
}
