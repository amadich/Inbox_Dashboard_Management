"use client";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Settings() {
  const userInfo = TokenInfoUser();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setUser(userInfo ? { 
      firstName: userInfo.firstName || "", 
      lastName: userInfo.lastName || "", 
      email: userInfo.email || "", 
      role: userInfo.role || "",  
    } : null);
  }, [userInfo]);

  if (user === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">لم يتم العثور على المستخدم</p>
      </div>
    );
  }

  const handleLogout = () => {
    // Clear token from localStorage/sessionStorage or cookies
    localStorage.removeItem("token"); 
    window.location.href = "/"; 
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Cog6ToothIcon className="h-6 w-6 text-gray-500" />
        <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
      </div>

      <p className="text-gray-500 ">قم بإدارة إعداداتك وتفضيلاتك هنا.</p>
      <p className="text-gray-500 mb-6">
        ملاحظة : هذه الصفحة قيد التطوير تحتوي على تغيرات في كل ثانية كل ما عليك فقط تسجيل الخروج حاليا
      </p>

      <div className="flex space-x-8">
        {/* Left Box (User Details) */}
        <div className="flex-1 bg-base-100 shadow-md p-6 w-full max-w-md">
          <div className="card-body space-y-2">
            <h2 className="card-title text-xl mb-2">معلومات المستخدم</h2>

            <div>
              <span className="font-semibold">الاسم الكامل:</span> {user.firstName} {user.lastName}
            </div>
            <div>
              <span className="font-semibold">البريد الإلكتروني:</span> {user.email}
            </div>
            <div>
              <span className="font-semibold">الدور:</span> <span className="badge badge-info text-white">{user.role}</span>
            </div>

            {/* Logout Button */}
            <div className="mt-4">
              <button onClick={handleLogout} className="btn bg-[#ff00006c] w-full">
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        {/* Right Box (Dashboard Overview) */}
        <div className="flex-1 bg-gray-100 shadow-md p-6 w-full max-w-md">
          <div className="card-body space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">لوحة معلومات الشركة</h2>
            <p className="text-gray-600">
              مرحبًا بك في لوحة معلومات الشركة! هنا يمكنك مراقبة المقاييس الرئيسية والنشاطات الأخيرة للبقاء على اطلاع بأداء فريقك.
            </p>
            
            {/* Activity Overview */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-700">النشاطات الأخيرة</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>اجتماع الفريق مع تطوير المنتج</li>
                <li>تحديثات مراجعة الأداء</li>
                <li>إكمال تقرير مبيعات الربع الأول</li>
              </ul>
            </div>

         
          </div>
        </div>
      </div>
    </div>
  );
}
