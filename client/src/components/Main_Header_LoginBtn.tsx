"use client";
import { useState, useEffect } from "react";
import LoginModal from "@/app/(pages)/Register/Login/page";

export default function Main_Header_LoginBtn() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTokenPresent, setIsTokenPresent] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    setIsTokenPresent(!!token); // Set the state based on whether the token is present
  }, []);

  const openLoginModal = () => {
    setIsLoginOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);
  };

  return (
    <>
      {/* Only show the login button if there's no token */}
      {!isTokenPresent && (
        <button
          onClick={openLoginModal}
          disabled={isLoginOpen}
          className="bg-[#333] py-2 px-4 rounded-lg text-white hover:bg-primary-focus transition-all"
        >
          Login
        </button>
      )}
      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />
    </>
  );
}
