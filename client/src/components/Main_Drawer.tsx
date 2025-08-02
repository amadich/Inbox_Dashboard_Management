'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HomeIcon, CheckCircleIcon, CalendarIcon, BoltIcon, FolderIcon, ChartBarIcon, UserGroupIcon, UsersIcon, CogIcon , CurrencyDollarIcon, BanknotesIcon , PresentationChartBarIcon, DocumentCurrencyDollarIcon } from '@heroicons/react/24/outline';

const Icons = {
  HomeIcon,
  CheckCircleIcon,
  CalendarIcon,
  BoltIcon,
  FolderIcon,
  ChartBarIcon,
  UserGroupIcon,
  UsersIcon,
  CogIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  PresentationChartBarIcon,
  DocumentCurrencyDollarIcon
};

import navLinks from '@/data/navLinks.json'; // Import the JSON file
import SotetelLogo from '@/assets/images/2_dd.png';
import SideBarLeftIcon from "@/assets/icons/sidebar-left.svg";
import Main_Drawer_UserProfile from './Main_Drawer_UserProfile';
import { TokenInfoUser } from './authUsers/TokenInfoUser';

export default function Main_Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Get user information (like role)
  const userInfo = TokenInfoUser();

  // Determine if user is ADMIN or MANAGER
  const isAdminOrManager = userInfo?.role === 'ADMIN' || userInfo?.role === 'MANAGER';

  // Filter links based on the user's role
  const filteredLinks = navLinks.filter((link) => {
    if (isAdminOrManager) {
      return true; // Show all links for ADMIN and MANAGER
    }
    return link.access === 0; // Only show links with access 0 for other roles
  });

  // Group links by category
  const groupedLinks = filteredLinks.reduce((acc: { [key: string]: typeof filteredLinks }, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {});

  return (
    <div style={isOpen ? { width: "20%" } : { width: "5%" }} className="transition-all duration-300 ease-in-out">
      <div
        className={`fixed h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden overflow-y-auto shadow-sm transition-all duration-300 ease-in-out ${isOpen ? 'w-40 md:w-64' : 'w-16 md:w-16'}`}
        onMouseEnter={() => setIsOpen(true)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
        display: none;
          }
        `}</style>

        {/* Toggle Button */}
        <div className="absolute top-4 left-40 z-10">
          <button onClick={toggleDrawer} className="ml-16 py-2 text-gray-700 hover:bg-gray-200 rounded-full">
            <Image src={SideBarLeftIcon} alt="SideBar Left Icon" width={20} height={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="m-3 flex select-none">
          <Image src={SotetelLogo} alt="Sotetel Logo" width={150} height={150} draggable={false} />
          {/* {isOpen && <span className="font-bold text-blue-900 text-xs pl-3">Company <br /><span className="text-orange-500">Dashboard</span></span>} */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          {/* Render Projects and Activities first (at the top) */}
          {groupedLinks['OTHER'] && (
            <div className="mt-4">
              {isOpen && <p className="font-bold text-gray-500 text-xs pl-5"></p>}
              <ul className="space-y-2">
                {groupedLinks['OTHER'].map((link) => {
                  const IconComponent = Icons[link.icon as keyof typeof Icons];
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`group flex items-center px-5 py-2 rounded transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                      >
                        <IconComponent className={`h-6 w-6 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                        {isOpen && <span className="ml-2 text-xs">{link.title}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Render MAIN Links */}
          {groupedLinks['MAIN'] && (
            <div className="mt-4">
              {isOpen && <p className="font-bold text-blue-500 text-xs pl-5">الرئيسية</p>}
              <ul className="space-y-2">
                {groupedLinks['MAIN'].map((link) => {
                  const IconComponent = Icons[link.icon as keyof typeof Icons];
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`group flex items-center px-5 py-2 rounded transition-all duration-300 ${isActive ? 'bg-blue-100 text-green-900' : 'text-gray-700 hover:bg-gray-200'}`}
                      >
                        <IconComponent className={`h-6 w-6 ${isActive ? 'text-green-900' : 'text-gray-500'}`} />
                        {isOpen && <span className="ml-2 text-xs">{link.title}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Render FinanceDepartment Links */}
          {groupedLinks['FinanceDepartment'] && (
            <div className="mt-4">
              {isOpen && <p className="font-bold text-gray-500 text-xs pl-5">قسم المالية</p>}
              <ul className="space-y-2">
                {groupedLinks['FinanceDepartment'].map((link) => {
                  const IconComponent = Icons[link.icon as keyof typeof Icons];
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`group flex items-center px-5 py-2 rounded transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                      >
                        <IconComponent className={`h-6 w-6 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                        {isOpen && <span className="ml-2 text-xs">{link.title}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Render RECORDS Links */}
          {groupedLinks['RECORDS'] && (
            <div className="mt-4">
              {isOpen && <p className="font-bold text-gray-500 text-xs pl-5">السجلات</p>}
              <ul className="space-y-2">
                {groupedLinks['RECORDS'].map((link) => {
                  const IconComponent = Icons[link.icon as keyof typeof Icons];
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`group flex items-center px-5 py-2 rounded transition-all duration-300 ${isActive ? 'bg-blue-100 text-blue-500' : 'text-gray-700 hover:bg-gray-200'}`}
                      >
                        <IconComponent className={`h-6 w-6 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                        {isOpen && <span className="ml-2 text-xs">{link.title}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <Main_Drawer_UserProfile />
      </div>
    </div>
  );
}
