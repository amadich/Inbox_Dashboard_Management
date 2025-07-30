"use client";

import { useState } from "react";
import Image from "next/image";
import iconHelp from "@/assets/icons/help-circle.svg";
import iconNotification from "@/assets/icons/notification-alarm.svg";

export default function Menu_Header_NotificationDropDown() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-20 flex justify-between items-center">
      {/* Help Button */}
      <div>
        <Image
          src={iconHelp}
          width={35}
          height={35}
          alt="help"
          className="bg-white rounded-full p-1"
        />
      </div>

      {/* Notification Button */}
      <div>
        {/* Notification dropdown */}
        <div className="dropdown dropdown-end">
          <div
            onClick={handleMenuToggle} // Toggling the menu on click
            className="btn btn-ghost btn-circle"
            tabIndex={0}
            role="button"
          >
            <div className="indicator">
              <Image
                src={iconNotification}
                width={31}
                height={31}
                alt="notification"
                className="bg-white rounded-full p-[6px] cursor-pointer"
              />
              <span className="badge badge-sm indicator-item">8</span> {/* Notification count */}
            </div>
          </div>

          {/* Dropdown content for notifications */}
          {isMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <a className="justify-between">
                  Notification 1
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Notification 2</a>
              </li>
              <li>
                <a>Notification 3</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
