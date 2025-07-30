"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROJECTS , DELETE_PROJECT } from "@/app/graphql/projectMutation";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow";
import Image from "next/image";
import iconSotetel from "@/assets/icons/cropped-favicon-32x32.png";
import LogoSotetel from "@/assets/images/sotetel_logo.png";
import Swal from "sweetalert2";
import { FunnelIcon, PlusIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  teamMembers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

const ProjectsMainPage = () => {
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // mutation to delete project
  const [DELETE_PROJECT_NOW] = useMutation(DELETE_PROJECT);

  // Extract user ID and role from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  if (loading) return <LoadingShow msg="جاري تحميل المشاريع..." />;
  if (error) return <LoadingShow msg="خطأ في تحميل المشاريع" />;

  const projects = data?.projects || [];

  // Filter projects based on search query, status filter, and user role/access
  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    const hasAccess = userRole === "MANAGER" || userRole === "ADMIN" 
      ? true 
      : project.teamMembers.some(member => member.id === userId);

    return matchesSearch && matchesStatus && hasAccess;
  });

  // Navigate to edit project page
  const handleEditProject = (projectId: string) => {
    router.push(`/Projects/UpdateProject/${projectId}`);
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لا يمكن التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      // Call your delete project mutation here
      await DELETE_PROJECT_NOW({
        variables: {
          inputDelete: {
            userId: userId,
            id: projectId,
            
          },
        },
      });
      // Optionally, refetch projects or update local state
      Swal.fire('تم الحذف!', 'تم حذف المشروع بنجاح.', 'success');
      location.reload();
    }
  };

  // Check if the user is an Admin or Manager
  const isAdminOrManager = userRole === "MANAGER" || userRole === "ADMIN";

  return (
    <div className="mx-auto p-6 space-y-6 bg-white rounded-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <Image
            src={LogoSotetel}
            alt="Sotetel"
            width={100}
            height={100}
            draggable={false}
          />
          <p className="text-gray-500">مشاريع داخل الصندوق</p>
        </div>
      </div>

      {/* Search and Actions Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="ابحث عن المشاريع..."
            className="input input-bordered w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>

        <div className="relative flex items-center space-x-4 z-30">
          <div className="dropdown dropdown-start">
            <div tabIndex={0} role="button" className="flex items-center btn rounded-lg m-1">
              <FunnelIcon className="w-6 h-6" /> <p>تصفية الحالة</p>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1  p-2 shadow-sm">
              <li><span onClick={() => setStatusFilter("")}>الكل</span></li>
              <li><span className="flex justify-between items-center" onClick={() => setStatusFilter("ACTIVE")}> <p>نشط</p> <div className="relative flex items-center justify-center"><span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></div></span></li>
              <li><span className="flex justify-between items-center" onClick={() => setStatusFilter("ON_HOLD")}> <p>قيد الانتظار</p> <div className="relative flex items-center justify-center"><span className="absolute inline-flex h-3 w-3 rounded-full bg-orange-400 opacity-75 animate-ping"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></div></span></li>
              <li><span className="flex justify-between items-center" onClick={() => setStatusFilter("COMPLETED")}> <p>مكتمل</p> <div className="relative flex items-center justify-center"><span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></div></span></li>
            </ul>
          </div>

          {isAdminOrManager && (
            <button
              onClick={() => router.push("/Projects/CreateProject")}
              className="btn py-3 font-semibold rounded-md shadow-md bg-white text-[#333] border-[#333] duration-300 hover:text-white hover:bg-[#333]"
            >
              <PlusIcon className="w-4 h-4" /> إنشاء مشروع جديد
            </button>
          )}
        </div>
      </div>

      {/* Projects Table */}
      <div className="scroll-container">
        <table className="table w-full text-left">
          <thead>
            <tr>
              <th className="text-gray-700">العنوان</th>
              <th className="text-gray-700">الوصف</th>
              <th>الفريق</th>
              <th className="text-gray-700">الحالة</th>
              <th className="text-gray-700">تاريخ البدء</th>
              <th className="text-gray-700">تاريخ الانتهاء</th>
              {isAdminOrManager && <th className="text-gray-700">إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project: Project) => (
              <tr key={project.id}>
                <td onClick={() => router.push(`/Projects/${project.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-5 w-5">
                        {project.status === 'ACTIVE' && (
                          <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </div>
                        )}
                        {project.status === 'ON_HOLD' && (
                          <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-orange-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </div>
                        )}
                        {project.status === 'COMPLETED' && (
                          <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </div>
                        )}
                        <Image
                          src={iconSotetel}
                          alt="Sotetel"
                          width={48}
                          height={48}
                          className="mask mask-squircle"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{project.title}</div>
                      <div className="text-sm opacity-50" title={project.description}>
                        {project.description.length > 10 ? `${project.description.substring(0, 10)}...` : project.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td>{project.description.substring(0, 100)}</td>
                <td>
                  <div className="avatar-group -space-x-2">
                    {project.teamMembers.slice(0, 4).map((member) => (
                      <div key={member.id} className="avatar">
                        <div className="w-6">
                          <img
                            src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                            alt="Sotetel"
                            width={32}
                            height={32}
                            className="mask mask-squircle select-none"
                            draggable={false}
                          />
                        </div>
                      </div>
                    ))}
                    {project.teamMembers.length > 4 && (
                      <div className="avatar avatar-placeholder">
                        <div className="bg-slate-100 text-neutral-800 w-6">
                          <span className="font-semibold">+{project.teamMembers.length - 4}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                <td>
                  <span
                  className={`badge space-x-2 text-xs font-medium select-none border-none shadow-none duration-150 hover:shadow-sm ${project.status === 'ACTIVE' ? ' text-green-600 bg-[#94fcae8e] shadow-green-500' : project.status === 'ON_HOLD' ? 'w-24 bg-[#fae52a98] shadow-amber-400 ' : 'bg-[#fc1fa05b] shadow-pink-400 '}`}
                  >
                  <span className={`inline-block w-2 h-2 rounded-full ${project.status === 'ACTIVE' ? 'bg-green-500' : project.status === 'ON_HOLD' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <span>
                    {project.status === 'ACTIVE'
                    ? 'نشط'
                    : project.status === 'ON_HOLD'
                    ? 'قيد الانتظار'
                    : project.status === 'COMPLETED'
                    ? 'مكتمل'
                    : project.status}
                  </span>
                  </span>
                </td>

                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                <td>{new Date(project.endDate).toLocaleDateString()}</td>

                {isAdminOrManager && (
                  <td className="flex items-center justify-center gap-3">
                    <div className="dropdown dropdown-left">
                      <button className="btn btn-ghost btn-xs" tabIndex={0}>
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-700" />
                      </button>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-40">
                        <li>
                          <button
                            onClick={() => handleEditProject(project.id)}
                            className="hover:bg-[whitesmoke] hover:text-black p-2 rounded-md w-full text-left"
                          >
                            تعديل
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-error hover:bg-error hover:text-white p-2 rounded-md w-full text-left"
                          >
                            حذف
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsMainPage;
