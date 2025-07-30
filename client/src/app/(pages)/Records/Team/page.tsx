"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "@/app/graphql/projectMutation";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow";
import Image from "next/image";
import ShadingImage from "@/assets/images/shading.png";
import LogoSotetel from "@/assets/images/sotetel_logo.png";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import "@/assets/styles/Main_Projects.css";
import Snowflakes from "@/components/Snowflakes";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  color: string;
  startDate: string;
  endDate: string;
  teamMembers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

const TeamPage = () => {
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<Project["teamMembers"]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <LoadingShow msg="جاري تحميل المشاريع..." />;
  }

  if (error) {
    return <LoadingShow msg="خطأ في تحميل المشاريع" />;
  }

  const projects = data?.projects || [];

  // Filter projects based on the search query and status filter
  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearchQuery = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatusFilter = statusFilter ? project.status === statusFilter : true;
    return matchesSearchQuery && matchesStatusFilter;
  });

  const handleTeamMemberClick = (team: Project["teamMembers"]) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <Snowflakes />
        <div className="mx-auto p-6 space-y-6 bg-[whitesmoke] rounded-lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Image src={LogoSotetel} alt="Sotetel" width={100} height={100} draggable={false} />
                  <p className="text-gray-500">داخل الصندوق <span className="text-blue-500 font-semibold">الفريق</span> <span className="text-black">المشاريع</span></p>
                </div>
              </div>

              {/* Search & Filter Section */}
              <div className="flex justify-between items-center mb-4">
                
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="ابحث عن المشاريع"
                    className="input input-bordered w-full max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="absolute right-4 w-5 h-5 text-gray-500" />
                </div>
                
                
                <div className="relative flex items-center space-x-4">
                  <div className="dropdown dropdown-start">
                    <button className="btn btn-outline flex items-center">
                      <FunnelIcon className="w-6 h-6" />
                      <p>تصفية الحالة</p>
                    </button>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[100] w-52 p-2 ml-[-200px] shadow-sm">
                      <li>
                        <span onClick={() => setStatusFilter("")}>الكل</span>
                      </li>
                      <li>
                        <span onClick={() => setStatusFilter("ACTIVE")}>نشط</span>
                      </li>
                      <li>
                        <span onClick={() => setStatusFilter("ON_HOLD")}>معلق</span>
                      </li>
                      <li>
                        <span onClick={() => setStatusFilter("COMPLETED")}>مكتمل</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Projects Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project: Project) => (
                    <div key={project.id} className="card bg-white  rounded-lg overflow-hidden" style={{ backgroundImage: `url(${ShadingImage.src})`, backgroundSize: "50%" }}>
                      <div className="card-header p-4 bg-gray-50 flex items-center justify-between cursor-pointer duration-150 hover:text-gray-500 " onClick={() => router.push(`/Projects/${project.id}`)}>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div 
                              style={{ backgroundColor: project.color }}
                              className="mask mask-squircle h-6 w-6 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              <p className="text-lg">
                                  {project.title.charAt(0).toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-lg">{project.title}</div>
                            <div className="text-sm text-gray-500" title={project.description}>
                              {project.description.length > 40 ? `${project.description.substring(0, 40)}...` : project.description}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-xs text-gray-500">{new Date(project.startDate).toLocaleDateString()}</div>
                            <div className="text-xs text-pink-500 font-semibold"> <span>انتهاء : </span> {new Date(project.endDate).toLocaleDateString()}</div>
                          </div>
                          <div className="badge text-xs capitalize p-2">
                            {project.status === "ACTIVE" && <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg">نشط</span>}
                            {project.status === "ON_HOLD" && <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-lg">معلق</span>}
                            {project.status === "COMPLETED" && <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg">مكتمل</span>}
                          </div>
                        </div>
                        <div className="avatar-group -space-x-2 mb-4">
                          {project.teamMembers.slice(0, 4).map((member) => (
                            <div key={member.id} className="avatar">
                              <div className="w-10">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                                  alt="Avatar"
                                  width={32}
                                  height={32}
                                  className="mask mask-squircle cursor-pointer"
                                  draggable={false}
                                  onClick={() => router.push(`/Profile/${member.id}`)}
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
                        <button
                          onClick={() => handleTeamMemberClick(project.teamMembers)}
                          className="btn btn-outline btn-xs w-full bg-red-950 text-white mt-2"
                        >
                          عرض الفريق
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-500">
                    لم يتم العثور على مشاريع.
                  </div>
                )}
              </div>

              {/* Modal for Team Members (Custom Modal) */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-[whitesmoke] p-6 rounded-xl shadow-xl w-96">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">أعضاء الفريق</h3>
                      <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                        ✕
                      </button>
                    </div>
                    <div className="space-y-4">
                      {selectedTeam.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-16 h-16 mask mask-squircle">
                              <img
                                src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                                alt="Avatar"
                                className="cursor-pointer"
                                width={48}
                                height={48}
                                onClick={() => router.push(`/Profile/${member.id}`)}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">{`${member.firstName} ${member.lastName}`}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={closeModal} className="btn btn-success text-white w-full mt-4">إغلاق</button>
                  </div>
                </div>
              )}
            </div>
    </>
  );
};

export default TeamPage;
