"use client";

import { useState } from "react";
import Image from "next/image";
import iconNotification from "@/assets/icons/notification-alarm.svg";
import iconHelp from "@/assets/icons/help-circle.svg";
import { CheckCircleIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import { gql, useQuery } from "@apollo/client";
import { formatDistanceToNow } from "date-fns"; // Importing formatDistanceToNow from date-fns
import { useRouter } from "next/navigation";

// GraphQL Query to fetch announcements
const GET_ANNOUNCEMENTS = gql`
  query Announcement {
    announcements {
      id
      title
      content
      senderId
      sender {
        id
        email
        firstName
        lastName
        role
      }
      visibility
      visibleTo
      createdAt
    }
  }
`;

interface Notification {
  id: string;
  title: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  visibility: "all" | "specific";
  visibleTo: string[];
  createdAt: string;
}

export default function Menu_Header_NotificationDropLeft({ myID }: { myID: string }) {

  const router = useRouter();

  // State to manage if the drawer is open or closed
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | "all">("all"); // Role filter state

  // Toggle drawer open/close
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Fetch announcements from the server
  const { data, loading, error } = useQuery(GET_ANNOUNCEMENTS);

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p>خطأ في جلب الإعلانات: {error.message}</p>;

  // Filter notifications based on visibility and whether `myID` is in `visibleTo`
  const notifications = (data?.announcements || []).filter((notification: Notification) => {
    if (notification.visibility === "all") {
      return true; // Show all notifications if visibility is "all"
    }
    if (notification.visibility === "specific") {
      return notification.visibleTo.includes(myID); // Show notification if `myID` is in `visibleTo`
    }
    return false; // Do not show the notification for other visibility types
  });

  // Filter notifications based on the selected role
  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (selectedRole === "all") return true; // No role filter, show all
    return notification.sender.role === selectedRole; // Filter by selected role
  });

  // Sort notifications based on `createdAt` in descending order
  const sortedNotifications = filteredNotifications.sort((a: Notification, b: Notification) => {
    return new Date(parseInt(b.createdAt)).getTime() - new Date(parseInt(a.createdAt)).getTime();
  });

  const notificationCount = sortedNotifications.length;

  // Handle role filter changes
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <>
      <div className="w-20 flex justify-between items-center">
        <div className="relative drawer drawer-end z-[999]">
          {/* Checkbox for drawer toggle */}
          <input
            id="my-drawer-4"
            type="checkbox"
            className="drawer-toggle"
            checked={drawerOpen}
            onChange={handleDrawerToggle} // Toggle drawer state
          />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-4" className="z-[100]">
              {/* Notification Icon container */}
              <div className="relative flex items-center justify-center">
                {/* Notification Icon */}
                <Image
                  src={iconNotification}
                  width={32} // Adjust size to 32px
                  height={32} // Adjust size to 32px
                  alt="الإشعارات"
                  className="bg-white rounded-full p-[6px] cursor-pointer z-10"
                />
                {/* Conditionally render the notification count */}
                {!drawerOpen && notificationCount > 0 && (
                  <span className="badge badge-sm indicator-item absolute top-0 right-[20px] translate-x-[50%] translate-y-[-50%]">
                    {notificationCount}
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* Help Icon placed separately with spacing */}
          <div className="absolute top-0 left-[-20px] z-0"> {/* Spacing the Help icon 50px to the right */}
            <Image
              src={iconHelp}
              width={32} // Adjust size to 32px
              height={32} // Adjust size to 32px
              alt="المساعدة"
              className="bg-white rounded-full p-[6px] cursor-pointer z-0"
            />
          </div>

          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="إغلاق الشريط الجانبي"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <h2 className="text-lg font-bold">الإشعارات</h2>
              <div>
                <p className="text-gray-600">{`لديك ${notificationCount} إشعار جديد${notificationCount > 1 ? "ات" : ""}`}</p>
              </div>
              {/* Notification items */}
              <div className="flex items-center space-x-4 mt-4 border-b border-gray-300 pb-1">
                <p className="text-black underline decoration-2 underline-offset-8 duration-150 cursor-pointer">النشاط</p>
                <p className="text-black duration-150 hover:text-gray-600 cursor-not-allowed">الأرشيف</p>
              </div>

              {/* Role Filter */}
              <div className="dropdown dropdown-start">
                <div tabIndex={0} role="button" className="w-20 flex items-center rounded-lg text-center bg-gray-200 space-x-4 p-1 mt-4">
                  <RectangleGroupIcon className="w-4 h-4" />
                  <p>تصفية</p>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  <li>
                    <span onClick={() => handleRoleChange("all")}>الكل</span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("ADMIN")}>
                      <p>مدير</p>
                      {selectedRole === "ADMIN" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("MANAGER")}>
                      <p>مدير فريق</p>
                      {selectedRole === "MANAGER" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("TEAM")}>
                      <p>فريق</p>
                      {selectedRole === "TEAM" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("CLIENT")}>
                      <p>عميل</p>
                      {selectedRole === "CLIENT" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-teal-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              {/*  Received Notifications ...  */}
              {sortedNotifications.map((notification: Notification) => {
                const formattedTime = notification.createdAt
                  ? formatDistanceToNow(new Date(parseInt(notification.createdAt)))
                  : "وقت غير معروف";

                return (
                  <div
                    key={notification.id}
                    className="border-none p-4 rounded-lg mt-4 shadow-sm duration-150 hover:bg-white cursor-pointer"
                  >
                    <p className="flex items-center space-x-1 ">
                      <CheckCircleIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{notification.title}</span>
                    </p>

                    <div className="flex col-span-2 space-x-4 mt-2">
                      <div className="flex-shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?name=${notification.sender.firstName}+${notification.sender.lastName}&background=random`}
                          alt={`${notification.sender.firstName} ${notification.sender.lastName}`}
                          width={32}
                          className="rounded-full object-contain"
                          onClick={() => router.push(`/Profile/${notification.senderId}`)}
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center space-x-4">
                          <p className="text-gray-950 font-semibold">{notification.sender.firstName} {notification.sender.lastName}</p>
                          <p className="text-gray-500">{notification.sender.role}</p>
                        </div>
                        <div>
                          <p className="max-h-48 overflow-auto">{notification.content}</p>
                        </div>
                        <p className="text-gray-500">{formattedTime}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
