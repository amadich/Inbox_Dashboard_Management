"use client";

import { useEffect, useRef, useState } from "react";
import iconSearch from "@/assets/icons/search.svg";
import Image from "next/image";
import navLinks from "@/data/searchLinks.json";
import { useRouter } from "next/navigation";
import {
  HomeIcon as iconsHome,
  CheckCircleIcon as iconsCheckCircle,
  CalendarIcon as iconsCalendar,
  BoltIcon as iconsBolt,
  FolderIcon as iconsFolder,
  ChartBarIcon as iconsChartBar,
  UserGroupIcon as iconsUserGroup,
  UsersIcon as iconsUsers,
  CogIcon as iconsCog,
  UserIcon as iconsUser,
  PresentationChartBarIcon as iconsChartBarPresentation,
  BanknotesIcon as iconsBanknotes,
  CurrencyDollarIcon as iconsCurrencyDollar,
  DocumentCurrencyDollarIcon as iconsDocumentCurrencyDollar,
  BuildingOfficeIcon as BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import { TokenInfoUser } from "./authUsers/TokenInfoUser";

const Icons = {
  HomeIcon: iconsHome,
  CheckCircleIcon: iconsCheckCircle,
  CalendarIcon: iconsCalendar,
  BoltIcon: iconsBolt,
  FolderIcon: iconsFolder,
  ChartBarIcon: iconsChartBar,
  UserGroupIcon: iconsUserGroup,
  UsersIcon: iconsUsers,
  CogIcon: iconsCog,
  UserIcon: iconsUser,
  PresentationChartBarIcon: iconsChartBarPresentation,
  BanknotesIcon: iconsBanknotes,
  CurrencyDollarIcon: iconsCurrencyDollar,
  DocumentCurrencyDollarIcon: iconsDocumentCurrencyDollar,
  BuildingOfficeIcon: BuildingOfficeIcon
};

export default function SearchBar() {
  const userInfo = TokenInfoUser();
  const [userRole, setUserRole] = useState("");
  const [query, setQuery] = useState("");
  const [filteredLinks, setFilteredLinks] = useState<typeof navLinks>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const GetuserRole = userInfo?.role || "";
    setUserRole(GetuserRole);
  }, [userInfo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = navLinks.filter((link) => {
        const matchesQuery = link.title.toLowerCase().includes(query.toLowerCase());
        const isAllowed = link.access === 1 ? true : false;
        const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

        return matchesQuery && (isAllowed ? isAdminOrManager : true);
      });

      setFilteredLinks(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [query, userRole]);

  const handleSelect = (href: string) => {
    setQuery("");
    setShowDropdown(false);
    router.push(href);
  };

  return (
    <div className="relative">
      <input
        id="search_header_input"
        ref={inputRef}
        type="text"
        placeholder="ابحث عن شيء" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 md:pr-96 duration-150 2xl:hover:pr-[40em] py-2 border-none rounded-full focus:outline-none hidden md:block"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Image src={iconSearch} width={20} height={20} alt="search" />
      </div>

      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hidden md:block">
        Ctrl + K
      </span>

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 max-h-80 overflow-auto">
          {filteredLinks.length === 0 ? (
            <div className="p-4 text-gray-500">لم يتم العثور على نتائج.</div> 
          ) : (
            filteredLinks.map((link) => {
              const IconComponent = (Icons as any)[link.icon];
              const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

              return (
                <button
                  key={link.href}
                  onClick={() => handleSelect(link.href)}
                  className="flex items-start gap-3 w-full text-left p-3 hover:bg-gray-100 transition"
                >
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-gray-500 mt-1" />
                  )}
                  <div>
                    <span className="font-medium text-gray-800">{link.title}</span>
                    <div className="text-sm text-gray-500">
                      الفئة:{" "}
                      <span className="capitalize">
                        {link.category.toLowerCase()}
                      </span>
                      {link.access && isAdminOrManager && (
                        <>
                          {" "}
                          · الوصول:{" "}
                          <span className="text-green-600">مسموح</span> 
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
