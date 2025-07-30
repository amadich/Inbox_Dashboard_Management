"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

const CREATE_USER = gql`
  mutation createUser($user: UserInput!) {
    createUser(user: $user) {
      token
    }
  }
`;

const CreateUser = () => {


  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("FullTime");
  const [role, setRole] = useState("CLIENT");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
      const GetuserId = userInfo?.id || "";
      setUserId(GetuserId);
    }, [userInfo]);

  const [createUserMutation, { loading, error }] = useMutation(CREATE_USER);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare user data to send in mutation
    const userData = {
      userId,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      status,
      role,
      birthDate: birthDate || null,
    };

    try {
      // Call create user mutation
      const response = await createUserMutation({
        variables: {
          user: userData,
        },
      });

      const token = response?.data?.createUser?.token;

      // Show success message
      if (token) {
        Swal.fire({
          title: "تم إنشاء المستخدم بنجاح!",
          text: "تم إنشاء المستخدم وتم إنشاء رمز مميز.",
          icon: "success",
        });
        // Optionally redirect to another page (e.g., user management page)
        setTimeout(() => {
         location.href = "/Dashboard/ManageUsers";
        }, 2000);
        
      }
    } catch (err) {
      Swal.fire({
        title: "خطأ!",
        text: error?.message || "حدث خطأ ما!",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src={SotetelLogo} alt="Sotetel Logo" width={100} height={100}  />
          <h1 className="text-2xl font-semibold text-gray-800">إنشاء <span className="text-blue-500">مستخدم جديد</span></h1>
        </div>
        <button onClick={() => router.push("/Dashboard/ManageUsers")} className="text-gray-600 hover:text-gray-900">
          <p className="flex items-center gap-2">
            <span>العودة إلى المستخدمين</span> <ChevronRightIcon className="h-6 w-6" />
          </p>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-600">الاسم الأول</label>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-600">اسم العائلة</label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">كلمة المرور</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone-number" className="block text-sm font-medium text-gray-600">رقم الهاتف</label>
          <input
            id="phone-number"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>

        {/* Status - Badge Style */}
        <div>
          <label className="block text-sm font-medium text-gray-600">الحالة</label>
          <div className="mt-2 flex gap-2 flex-wrap">
            {["FullTime", "PartTime", "Intern", "Freelancer"].map((statusOption) => (
              <span
                key={statusOption}
                onClick={() => setStatus(statusOption)}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm ${
                  status === statusOption
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                } transition duration-300`}
              >
                {statusOption}
              </span>
            ))}
          </div>
        </div>

        {/* Role - Badge Style */}
        <div>
          <label className="block text-sm font-medium text-gray-600">الدور</label>
          <div className="mt-2 flex gap-2 flex-wrap">
            {["ADMIN", "MANAGER", "CLIENT", "TEAM", "GUEST"].map((roleOption) => (
              <span
                key={roleOption}
                onClick={() => setRole(roleOption)}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm ${
                  role === roleOption
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                } transition duration-300`}
              >
                {roleOption}
              </span>
            ))}
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label htmlFor="birth-date" className="block text-sm font-medium text-gray-600">تاريخ الميلاد (اختياري)</label>
          <input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#000] text-white rounded-lg shadow-lg hover:bg-[#333] transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
