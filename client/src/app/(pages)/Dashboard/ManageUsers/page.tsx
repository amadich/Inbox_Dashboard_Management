// pages/ManageUsers.tsx
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS , DELETE_USER } from "@/app/graphql/userMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow"; // Ensure you have this component for loading spinner
import { FunnelIcon, PlusIcon, EllipsisVerticalIcon , MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Image from "next/image";
import iconSotetel from "@/assets/icons/cropped-favicon-32x32.png";
import "@/assets/styles/Main_Projects.css";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";



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

    const userInfo = TokenInfoUser();
    const [userIdme, setUserId] = useState("");

     useEffect(() => {
        const GetuserId = userInfo?.id || "";
        setUserId(GetuserId);
      }, [userInfo]);

  const { data, loading, error } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const router = useRouter();
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
    const matchesSearchQuery = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoleFilter = roleFilter ? user.role === roleFilter : true;
    return matchesSearchQuery && matchesRoleFilter;
  });

  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لا يمكن التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      // Delete user and refetch users query
      await deleteUser({
        variables: {
          inputDelete: {
            userId: userIdme,
            id: userId,
          },
        },
        refetchQueries: [{ query: GET_USERS }],
      });
       
      Swal.fire('تم الحذف!', 'تم حذف المستخدم بنجاح.', 'success');
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6 bg-white rounded-lg">
      <div className="flex items-center justify-between select-none">
        <h2 className="text-3xl font-semibold text-gray-800 hidden">Users</h2>
        <div className="flex items-center space-x-2">
          <Image
            src={iconSotetel}
            alt="Sotetel"
            width={32}
            height={32}
            className="mask mask-squircle"
            draggable={false}
          />
          <p className="text-gray-500">داخل الصندوق صيانة المستخدمين</p>
        </div>
      </div>

      {/* Search Input and Filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex items-center ">
          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد الإلكتروني"
            className="input input-bordered w-full md:w-[800px] max-w-xs pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute right-3 w-5 h-5 text-gray-500" />
        </div>
        
        <div className="relative flex items-center space-x-4 z-30">
          {/* Role Filter */}
            <div className="dropdown dropdown-start">
              
                <div tabIndex={0} role="button" className="flex items-center btn rounded-lg m-1">
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

          <button
            onClick={() => router.push("/Dashboard/ManageUsers/CreateUser")} // Create User Page
            className="btn py-3 font-semibold rounded-md shadow-md bg-white text-[#333] border-[#333] duration-300 hover:text-white hover:bg-[#333]"
          >
            <PlusIcon className="w-4 h-4" /> إنشاء مستخدم جديد
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="scroll-container">
        <table className="table w-full text-left">
          <thead>
            <tr>
              <th></th>
              <th className="text-gray-700">الاسم الأول</th>
              <th className="text-gray-700">اسم العائلة</th>
              <th className="text-gray-700">البريد الإلكتروني</th>
              <th className="text-gray-700">رقم الهاتف</th>
              <th className="text-gray-700">الحالة</th>
              <th className="text-gray-700">الدور</th>
              <th className="text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                      alt="Sotetel User"
                      width={25}
                      height={25}
                      className="mask mask-squircle cursor-pointer"
                      draggable={false}
                      onClick={() => router.push(`/Profile/${user.id}`)}
                    />
                  </td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                     <span
                        className={`badge space-x-2 text-xs font-medium select-none border-none shadow-none duration-150 hover:shadow-sm ${
                           user.status === "FullTime"
                           ? "text-green-600 bg-[#94fcae8e] shadow-green-500"
                           : user.status === "PartTime"
                           ? "bg-[#fae52a98] shadow-amber-400"
                           : user.status === "Intern"
                           ? "bg-[#8c77fc75] shadow-indigo-400"
                           : user.status === "Freelancer"
                           ? "bg-[#fc1fa05b] shadow-pink-400"
                           : ""
                        }`}
                     >
                        <span
                           className={`inline-block w-2 h-2 rounded-full ${
                           user.status === "FullTime"
                              ? "bg-green-500"
                              : user.status === "PartTime"
                              ? "bg-yellow-500"
                              : user.status === "Intern"
                              ? "bg-blue-500"
                              : user.status === "Freelancer"
                              ? "bg-red-500"
                              : ""
                           }`}
                        ></span>
                        <span>
                           {user.status === "FullTime"
                           ? "دوام كامل"
                           : user.status === "PartTime"
                           ? "دوام جزئي"
                           : user.status === "Intern"
                           ? "متدرب"
                           : user.status === "Freelancer"
                           ? "مستقل"
                           : ""}
                        </span>
                     </span>
                  </td>

                  <td>
                        <span
                          className={`badge space-x-2 text-xs font-medium select-none border-none shadow-none duration-150 hover:shadow-sm ${
                            user.role === "ADMIN"
                              ? "text-red-600 bg-red-100 shadow-red-500"
                              : user.role === "MANAGER"
                              ? "text-purple-600 bg-purple-100 shadow-purple-500"
                              : user.role === "CLIENT"
                              ? "text-gray-600 bg-gray-100 shadow-gray-500"
                              : user.role === "TEAM"
                              ? "text-cyan-600 bg-cyan-100 shadow-cyan-500"
                              : user.role === "GUEST"
                              ? "text-yellow-600 bg-yellow-100 shadow-yellow-500"
                              : "text-gray-600 bg-gray-200 shadow-gray-500"
                          }`}
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-red-600"
                                : user.role === "MANAGER"
                                ? "bg-purple-600"
                                : user.role === "CLIENT"
                                ? "bg-gray-600"
                                : user.role === "TEAM"
                                ? "bg-cyan-600"
                                : user.role === "GUEST"
                                ? "bg-yellow-600"
                                : "bg-gray-400"
                            }`}
                          ></span>
                          <span>{user.role}</span>
                        </span>
                    </td>


                  <td className="flex items-center justify-center gap-3">
                    <div className="dropdown dropdown-left">
                      <button className="btn btn-ghost btn-xs" tabIndex={0}>
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-700" />
                      </button>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-40">
                        <li>
                          <button className="hover:bg-[whitesmoke] hover:text-black p-2 rounded-md w-full text-left" onClick={() => router.push(`/Dashboard/ManageUsers/UpdateUser/${user.id}`)}>
                            تعديل
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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
                <td colSpan={7} className="text-center text-gray-500">
                  لا يوجد مستخدمون.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
