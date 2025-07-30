"use client";

import { useState, useEffect } from "react";
import Main_Header_LoginBtn from "./Main_Header_LoginBtn";
import { jwtDecode } from "jwt-decode";
import Menu_Header_NotificationDropLeft from "./Menu_Header_NotificationDropLeft";
import SearchBar from "./SearchBar";

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Main_Header() {

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // State to store user info
  const [isClient, setIsClient] = useState(false); // Flag to track if it's running on the client side

  useEffect(() => {
    // This ensures the code only runs on the client
    setIsClient(true);

    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token to get user info
        const decoded: any = jwtDecode(token);
        setUserInfo({
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
        }); // Set the decoded user info
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  // Prevent hydration mismatch by rendering conditionally based on client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      <header className=" w-[95%] flex justify-between items-center m-auto p-4">
        <div>
          {
            userInfo ? (
              <>
                <p className="text-gray-600">
                  {new Date().getHours() >= 6 && new Date().getHours() < 18 ? "صباح الخير, ☀" : "مساء الخير, 🌙"}
                </p>
                <p className="font-bold" title={`${userInfo.firstName} ${userInfo.lastName}`}>
                  {userInfo.firstName}{" "}
                  {userInfo.lastName.length > 10
                  ? `${userInfo.lastName.substring(0, 10)}...`
                  : userInfo.lastName}
                </p>
              </>
            ) : (
                <p className="text-gray-600">
                Welcome {new Date().getHours() >= 6 && new Date().getHours() < 18 ? "☀️" : "🌙"}
                </p>
            )
          }
        </div>

        {
          /*
              <div className="relative">
              <input
                id="search_header_input"
                type="text"
                placeholder="Find something"
                className="pl-10 md:pr-96 duration-150 2xl:hover:pr-[40em] py-2 border-none rounded-full focus:outline-none hidden md:block"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Image src={iconSearch} width={20} height={20} alt="search" />
              </div>

              
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hidden md:block">
                Ctrl + K
              </span>
            </div>
          */
        }

        <SearchBar />

        {/* <Menu_Header_NotificationDropDown /> */ }
        {
          userInfo && <Menu_Header_NotificationDropLeft myID={userInfo.id} /> 
        }
        <Main_Header_LoginBtn />



      </header>
    </>
  );
}
