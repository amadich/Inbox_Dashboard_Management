"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_CONTACT, GET_ALL_CONTACTS } from "@/app/graphql/contactOperations";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

const IRAQ_STATES = [
  "بغداد",
  "نينوى",
  "البصرة",
  "أربيل",
  "ذي قار",
  "السليمانية",
  "بابل",
  "كركوك",
  "الأنبار",
  "ديالى",
  "القادسية",
  "صلاح الدين",
  "المثنى",
  "واسط",
  "ميسان",
  "كربلاء",
  "النجف"
];

const CreateContact = () => {
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const [priority, setPriority] = useState("C");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  const [createContactMutation, { loading, error }] = useMutation(CREATE_CONTACT);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contactData = {
      priority,
      fullName,
      phone,
      address,
      city,
      state,
      zip,
      notes: notes || null
    };

    try {
      await createContactMutation({
        variables: { input: contactData },
        refetchQueries: [{ query: GET_ALL_CONTACTS }],
      });

      Swal.fire({
        title: "تمت الإضافة!",
        text: "تم إنشاء جهة الاتصال بنجاح",
        icon: "success",
      });

      setTimeout(() => {
        router.push("/Records/Contacts");
      }, 1500);
    } catch (err) {
      Swal.fire({
        title: "خطأ!",
        text: error?.message || "حدث خطأ أثناء الإضافة",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src={SotetelLogo} alt="Sotetel Logo" width={100} height={100} />
          <h1 className="text-2xl font-semibold text-gray-800">إضافة <span className="text-blue-500">جهة اتصال جديدة</span></h1>
        </div>
        <button 
          onClick={() => router.push("/Records/Contacts")} 
          className="text-gray-600 hover:text-gray-900"
        >
          <p className="flex items-center gap-2">
            <span>العودة إلى جهات الاتصال</span> <ChevronRightIcon className="h-6 w-6" />
          </p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-600">الأولوية</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {["A+", "A", "B", "C"].map((option) => (
                <span
                  key={option}
                  onClick={() => setPriority(option)}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm ${
                    priority === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  } transition duration-300`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
              الاسم الكامل
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
              الهاتف
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600">
              العنوان
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-600">
              المدينة
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-600">
              الولاية
            </label>
            <input
              id="state"
              type="text"
              value={state}
              list="state-list"
              onChange={(e) => setState(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
            <datalist id="state-list">
              {IRAQ_STATES.map((stateName) => (
                <option key={stateName} value={stateName} />
              ))}
            </datalist>
          </div>

          {/* ZIP */}
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-600">
              الرمز البريدي
            </label>
            <input
              id="zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-600">
            الملاحظات
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#000] text-white rounded-lg shadow-lg hover:bg-[#333] transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? "جاري الإضافة..." : "إضافة جهة اتصال"}
        </button>
      </form>
    </div>
  );
};

export default CreateContact;