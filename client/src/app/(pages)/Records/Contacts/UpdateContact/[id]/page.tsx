"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACT_BY_ID, UPDATE_CONTACT } from "@/app/graphql/contactOperations";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";
import LoadingShow from "@/components/LoadingShow";

// IRAQ States with full names
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

const UpdateContact = () => {
  const router = useRouter();
  const params = useParams();
  const contactId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  // Fetch contact data
  const { refetch } = useQuery(GET_CONTACT_BY_ID, {
    variables: { id: contactId },
    skip: !contactId,
    onCompleted: (data) => {
      const contact = data.getContactById;
      if (contact) {
        setPriority(contact.priority);
        setFullName(contact.fullName);
        setPhone(contact.phone);
        setAddress(contact.address);
        setCity(contact.city);
        setState(contact.state);
        setZip(contact.zip);
        setNotes(contact.notes || "");
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Error fetching contact:", error);
      setIsLoading(false);
      Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء تحميل بيانات جهة الاتصال",
        icon: "error",
      }).then(() => {
        router.push("/Records/Contacts");
      });
    }
  });

  const [updateContactMutation, { loading }] = useMutation(UPDATE_CONTACT);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    
    // Phone validation: XXX-XXX-XXXX format
    if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
      //newErrors.phone = "صيغة الهاتف يجب أن تكون XXX-XXX-XXXX";
    }
    
    if (!address.trim()) newErrors.address = "العنوان مطلوب";
    if (!city.trim()) newErrors.city = "المدينة مطلوبة";
    if (!state.trim()) newErrors.state = "الولاية مطلوبة";
    
    // ZIP validation: 5-digit format
    if (!/^\d{5}$/.test(zip)) {
      //newErrors.zip = "الرمز البريدي يجب أن يتكون من 5 أرقام";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updateData = {
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
      await updateContactMutation({
        variables: { 
          id: contactId,
          input: updateData 
        },
      });

      Swal.fire({
        title: "تم التحديث!",
        text: "تم تحديث جهة الاتصال بنجاح",
        icon: "success",
      });

      // Refetch the updated contact data
      refetch({ id: contactId });

      setTimeout(() => {
        router.push("/Records/Contacts");
      }, 1500);
    } catch (err) {
      console.error("Error updating contact:", err);
      
      let errorMessage = "حدث خطأ أثناء التحديث";
      if (typeof err === "object" && err !== null && "message" in err && typeof (err as any).message === "string") {
        if ((err as any).message.includes("phone")) {
          errorMessage = "رقم الهاتف مستخدم بالفعل";
        }
      }
      
      Swal.fire({
        title: "خطأ!",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  if (isLoading) {
    return <LoadingShow msg="جاري تحميل بيانات جهة الاتصال..." />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src={SotetelLogo} alt="Sotetel Logo" width={100} height={100} />
          <h1 className="text-2xl font-semibold text-gray-800">تحديث <span className="text-blue-500">جهة اتصال</span></h1>
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
              className={`mt-2 w-full px-4 py-3 border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg`}
            />
            {errors.fullName && <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
              الهاتف (XXX-XXX-XXXX)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="123-456-7890"
              className={`mt-2 w-full px-4 py-3 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg`}
            />
            {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
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
              className={`mt-2 w-full px-4 py-3 border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg`}
            />
            {errors.address && <p className="mt-1 text-red-500 text-sm">{errors.address}</p>}
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
              className={`mt-2 w-full px-4 py-3 border ${
                errors.city ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg`}
            />
            {errors.city && <p className="mt-1 text-red-500 text-sm">{errors.city}</p>}
          </div>

          {/* State - Autocomplete */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-600">
              الولاية
            </label>
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              list="state-list"
              required
              className={`mt-2 w-full px-4 py-3 border ${
                errors.state ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg`}
            />
            <datalist id="state-list">
              {IRAQ_STATES.map((stateName) => (
                <option key={stateName} value={stateName} />
              ))}
            </datalist>
            {errors.state && <p className="mt-1 text-red-500 text-sm">{errors.state}</p>}
          </div>

          {/* ZIP */}
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-600">
              الرمز البريدي (5 أرقام)
            </label>
            <input
              id="zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
              maxLength={5}
              placeholder="12345"
              className={`mt-2 w-full px-4 py-3 border ${
                errors.zip ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg`}
            />
            {errors.zip && <p className="mt-1 text-red-500 text-sm">{errors.zip}</p>}
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
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/Records/Contacts")}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition-colors duration-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "جاري التحديث..." : "تحديث جهة الاتصال"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateContact;