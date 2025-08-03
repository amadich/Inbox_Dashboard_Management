"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/app/graphql/userMutation";
import { useState } from "react";
import LoadingShow from "@/components/LoadingShow"; // Ensure you have this component for loading spinner
import { FunnelIcon , MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import LogoSotetel from "@/assets/images/sotetel_logo.png";
import "@/assets/styles/Main_Projects.css";
import UserTable from "@/app/components/Client/UserTable"; // Import the UserTable component

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  role: string;
  birthDate: string | null;
}

const ManageUsers = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  if (loading) {
    return <LoadingShow msg="جاري تحميل المستخدمين..." />;
  }

  if (error) {
    return <LoadingShow msg="خطأ في تحميل المستخدمين" />;
  }

  const users = data?.users || [];

  // Filter users based on the search query and role filter
  const filteredUsers = users.filter((user: User) => {
    const matchesSearchQuery =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoleFilter = roleFilter ? user.role === roleFilter : true;
    return matchesSearchQuery && matchesRoleFilter;
  });

  return (
    <div className="mx-auto p-6 space-y-6 bg-[snow] rounded-lg">
      <div className="flex items-center justify-between select-none">
        <h2 className="text-3xl font-semibold text-gray-800 hidden">Users</h2>
        <div className="flex items-center space-x-2">
          <Image
            src={LogoSotetel}
            alt="Sotetel"
            width={100}
            height={100}
            draggable={false}
          />
          <p className="text-gray-500">داخل الصندوق <span className="text-blue-500 font-semibold">الموظفين</span></p>
        </div>
      </div>

      {/* Search Input and Filter */}
      <div className="flex justify-between items-center mb-4">
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          placeholder="ابحث بالاسم أو البريد الإلكتروني"
          className="input input-bordered w-full pl-10" // Add padding to the left to make space for the icon
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>

        
        <div className="relative flex items-center space-x-4 z-30">
          {/* Role Filter */}
          <div className="dropdown dropdown-start">
              
                <div tabIndex={0} role="button" className="flex items-center btn rounded-lg m-1 ml-20">
                  <FunnelIcon className="w-6 h-6" />
                  <p>تصفية حسب الدور</p>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  <li><span onClick={() => setRoleFilter("")}>الكل</span></li>
                  <li>
                    <span className="flex justify-between items-center" onClick={() => setRoleFilter("ADMIN")}>
                      <p>مدير</p>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </div>
                    </span>
                  </li>
                  <li>
                    <span className="flex justify-between items-center" onClick={() => setRoleFilter("MANAGER")}>
                      <p>مدير فريق</p>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </div>
                    </span>
                  </li>
                  <li>
                    <span className="flex justify-between items-center" onClick={() => setRoleFilter("CLIENT")}>
                      <p>عميل</p>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-teal-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                      </div>
                    </span>
                  </li>
                  <li>
                    <span className="flex justify-between items-center" onClick={() => setRoleFilter("TEAM")}>
                      <p>فريق</p>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </div>
                    </span>
                  </li>
                  <li>
                    <span className="flex justify-between items-center" onClick={() => setRoleFilter("GUEST")}>
                      <p>زائر</p>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-3 w-3 rounded-full bg-gray-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                      </div>
                    </span>
                  </li>
                </ul>
              </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable users={filteredUsers} />
    </div>
  );
};

export default ManageUsers;