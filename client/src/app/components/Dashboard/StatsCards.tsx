"use client";

import { ArrowUpRightIcon, SparklesIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StatsCardsProps {
  totalStateCards: {
    totalProjects: number;
    totalUsers: number;
    totalTasks: number;
    doneTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    inReviewTasks: number;
  };
}

export default function StatsCards({ totalStateCards }: StatsCardsProps) {
  const router = useRouter();
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    // Load products data from localStorage
    const savedProducts = localStorage.getItem("productsData");
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      
      // Calculate total sales by summing all product sell prices
      const sales = products.reduce((acc: number, product: any) => {
        // Remove currency symbols and commas before converting to number
        const price = parseFloat(product.sellPrice.replace(/[^0-9.-]+/g, ""));
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      setTotalSales(sales);
    }
  }, []);

  const { totalProjects, totalUsers, todoTasks, totalTasks, doneTasks, inProgressTasks, inReviewTasks } = totalStateCards;

  const stats = [
    { title: "إجمالي المستخدمين", value: totalUsers, pushto: '/Dashboard/ManageUsers' },
    { title: "المهام الجديدة اليوم", value: todoTasks, pushto: '/Projects' },
    { 
      title: "إجمالي المبيعات", 
      value: totalSales.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      }), 
      pushto: '/Products' 
    },
  ];

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="md:flex justify-between items-center md:space-x-4">
        {/* First Card */}
        <div className="w-60 h-36 mt-5 border border-cyan-950 rounded-lg bg-gradient-to-br from-cyan-950 to-cyan-800 select-none">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-white text-lg font-semibold p-2">إجمالي المشاريع</h1>
            <ArrowUpRightIcon className="text-white w-8 h-8 border rounded-full p-2 duration-150 hover:text-black hover:bg-white cursor-pointer" onClick={() => router.push('/Projects')} />
          </div>
          <div className="mt-[-15px]">
            <h1 style={{ filter: "drop-shadow(0px 4px 10px white)" }} className="text-white text-3xl font-semibold pl-8">
              {totalProjects}
            </h1>
            <p className="flex items-center text-xs text-white space-x-4 pl-6 pt-2">
              <SparklesIcon className="w-6 h-6 pr-2" /> زيادة عن الشهر الماضي
            </p>
          </div>
        </div>

        {/* Stats Cards with hover functionality */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className="w-60 h-36 mt-5 bg-[whitesmoke] rounded-lg select-none"
            onMouseEnter={() => index == 1 ? setIsHovered(true) : null}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex justify-between items-center p-4">
              <h1 className="text-black text-lg font-semibold p-2">{stat.title}</h1>
              <ArrowUpRightIcon 
                className="text-black w-8 h-8 border border-black rounded-full p-2 duration-150 hover:text-white hover:bg-cyan-800 hover:border-none cursor-pointer" 
                onClick={() => router.push(stat.pushto ? stat.pushto : "")} 
              />
            </div>
            <div className="mt-[-15px]">
              <h1 style={{ filter: "drop-shadow(0px 4px 20px cyan)" }} className="text-black text-3xl font-semibold pl-8">
                {stat.value}
              </h1>
              <p className="flex items-center text-xs text-black space-x-4 pl-6 pt-2">
                <ShieldCheckIcon className="w-6 h-6 pr-2" /> زيادة عن الشهر الماضي
              </p>
            </div>

            {isHovered && stat.title === "المهام الجديدة اليوم" && (
              <div className="absolute bg-gradient-to-br from-blue-400 to-blue-300 shadow-lg p-4 mt-4 rounded-lg w-56 z-10">
                <div className=" flex justify-between text-sm font-semibold text-black"><p>تفاصيل المهام:</p> <p>✈️</p></div>
                <div className="mt-2">
                  <p className=" flex justify-between text-xs text-gray-700">إجمالي المهام: <b className="text-black">{totalTasks} </b></p>
                  <p className=" flex justify-between text-xs text-gray-700">المهام المكتملة:  <b className="text-black">{doneTasks} </b></p>
                  <p className=" flex justify-between text-xs text-gray-700">المهام المتبقية:  <b className="text-black">{todoTasks} </b></p>
                  <p className=" flex justify-between text-xs text-gray-700">المهام قيد التنفيذ: <b>{inProgressTasks} </b></p>
                  <p className=" flex justify-between text-xs text-gray-700">المهام قيد المراجعة:   <b>{inReviewTasks} </b></p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}