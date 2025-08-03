"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CONTACTS, DELETE_CONTACT } from "@/app/graphql/contactOperations";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow";
import { FunnelIcon, PlusIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Image from "next/image";
import iconSotetel from "@/assets/icons/cropped-favicon-32x32.png";
import "@/assets/styles/Main_Projects.css";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

interface Contact {
  id: string;
  priority: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
}

const ManageContacts = () => {
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_ALL_CONTACTS);
  const [deleteContact] = useMutation(DELETE_CONTACT);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  if (loading) return <LoadingShow msg="جاري تحميل جهات الاتصال..." />;
  if (error) return <LoadingShow msg="خطأ في تحميل جهات الاتصال" />;

  const contacts = data?.getAllContacts || [];

  // Filter contacts
  const filteredContacts = contacts.filter((contact: Contact) => {
    const matchesSearch = contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         contact.phone.includes(searchQuery) ||
                         contact.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter ? contact.priority === priorityFilter : true;
    return matchesSearch && matchesPriority;
  });

  const handleDeleteContact = async (id: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لا يمكن التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      await deleteContact({
        variables: { id },
        refetchQueries: [{ query: GET_ALL_CONTACTS }],
      });
      Swal.fire('تم الحذف!', 'تم حذف جهة الاتصال بنجاح.', 'success');
    }
  };

  // Priority badge styling
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'A+': return "bg-red-100 text-red-800";
      case 'A': return "bg-orange-100 text-orange-800";
      case 'B': return "bg-yellow-100 text-yellow-800";
      case 'C': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mx-auto h-full p-6 space-y-6 bg-white rounded-lg">
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <Image
            src={iconSotetel}
            alt="Sotetel"
            width={32}
            height={32}
            className="mask mask-squircle"
            draggable={false}
          />
          <p className="text-gray-500">إدارة جهات الاتصال</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الهاتف أو المدينة"
            className="input input-bordered w-full md:w-[800px] max-w-xs pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute right-3 w-5 h-5 text-gray-500" />
        </div>
        
        <div className="relative flex items-center space-x-4 z-30">
          {/* Priority Filter */}
          <div className="dropdown dropdown-start">
            <div tabIndex={0} role="button" className="flex items-center btn rounded-lg m-1">
              <FunnelIcon className="w-6 h-6" />
              <p>تصفية حسب الأولوية</p>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><span onClick={() => setPriorityFilter("")}>الكل</span></li>
              <li><span onClick={() => setPriorityFilter("A+")}>A+</span></li>
              <li><span onClick={() => setPriorityFilter("A")}>A</span></li>
              <li><span onClick={() => setPriorityFilter("B")}>B</span></li>
              <li><span onClick={() => setPriorityFilter("C")}>C</span></li>
            </ul>
          </div>

          <button
            onClick={() => router.push("/Records/Contacts/CreateContact")}
            className="btn py-3 font-semibold rounded-md shadow-md bg-white text-[#333] border-[#333] duration-300 hover:text-white hover:bg-[#333]"
          >
            <PlusIcon className="w-4 h-4" /> إضافة جهة اتصال
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="scroll-container">
        <table className="table w-full text-left">
          <thead>
            <tr>
              <th className="text-gray-700">الأولوية</th>
              <th className="text-gray-700">الاسم الكامل</th>
              <th className="text-gray-700">الهاتف</th>
              <th className="text-gray-700">العنوان</th>
              <th className="text-gray-700">المدينة</th>
              <th className="text-gray-700">الولاية</th>
              <th className="text-gray-700">ZIP</th>
              <th className="text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact: Contact) => (
                <tr key={contact.id}>
                  <td>
                    <span className={`badge ${getPriorityStyle(contact.priority)}`}>
                      {contact.priority}
                    </span>
                  </td>
                  <td>{contact.fullName}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.address}</td>
                  <td>{contact.city}</td>
                  <td>{contact.state}</td>
                  <td>{contact.zip}</td>
                  <td className="flex items-center justify-center gap-3">
                    <div className="dropdown dropdown-left">
                      <button className="btn btn-ghost btn-xs" tabIndex={0}>
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-700" />
                      </button>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-40">
                        <li>
                          <button 
                            className="hover:bg-[whitesmoke] hover:text-black p-2 rounded-md w-full text-left"
                            onClick={() => router.push(`/Records/Contacts/UpdateContact/${contact.id}`)}
                          >
                            تعديل
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-error hover:bg-error hover:text-white p-2 rounded-md w-full text-left"
                          >
                            حذف
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500">
                  لا توجد جهات اتصال.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageContacts;