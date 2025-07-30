"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER_TO_PROJECT, GET_USERS, GET_PROJECT_Title } from "@/app/graphql/projectMutation";
import Swal from "sweetalert2"; // Import SweetAlert2
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingShow from "@/components/LoadingShow";

export default function AddTeam({ params }: { params: Promise<{ id: string }> }) {
  const [projectId, setProjectId] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([]);

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT_Title, {
    variables: { projectId },
    skip: !projectId,  // Skip the query if projectId is not yet set
  });
  const [addUserToProject, { loading: mutationLoading }] = useMutation(ADD_USER_TO_PROJECT);
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => setProjectId(id));
  }, [params]);

  const filteredUsers = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.filter((user: any) =>
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [usersData, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || teamMemberIds.length === 0) return;

    try {
      for (const userId of teamMemberIds) {
        await addUserToProject({
          variables: {
            addUserToProject: {
              projectId,
              userId,
              teamName,
            },
          },
        });
      }

      // Using SweetAlert2 for success message
      Swal.fire({
        title: "نجاح!",
        text: "تمت إضافة أعضاء الفريق بنجاح!",
        icon: "success",
        confirmButtonText: "حسنًا",
      });

      setTeamMemberIds([]);
      setTeamName("");
      setSearchTerm("");
    } catch (err) {
      // Using SweetAlert2 for error message
      Swal.fire({
        title: "خطأ",
        text: "فشل في إضافة المستخدمين. يرجى المحاولة مرة أخرى لاحقًا.",
        icon: "error",
        confirmButtonText: "حسنًا",
      });
      console.error("Failed to add users:", err);
    }
  };

  // Loading state
  if (usersLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl text-center">
        <LoadingShow msg="جاري تحميل المستخدمين..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src={SotetelLogo} alt="Sotetel Logo" width={100} height={100}  />
          <h2 className="text-3xl font-semibold text-blue-500">إضافة <span className="text-black">أعضاء الفريق</span></h2>
        </div>
        <button onClick={() => router.push(`/Projects/${projectId}`)} className="text-gray-600 hover:text-gray-900">
          <p className="flex items-center gap-2">
            <span>العودة إلى كانبان</span> <ChevronRightIcon className="h-6 w-6" />
          </p>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Title */}
        {projectLoading ? (
          <p className="text-center text-gray-600">جاري تحميل المشروع...</p>
        ) : (
          <div className="text-center text-lg text-gray-600">
            <span className="font-semibold text-black">عنوان المشروع:</span> {projectData ? projectData?.project.title : projectId}
          </div>
        )}

        {/* Team Name Input */}
        <div>
          <label htmlFor="team-name" className="block text-sm font-medium text-gray-600">اسم الفريق</label>
          <input
            type="text"
            id="team-name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="أدخل اسم الفريق"
            required
          />
        </div>

        {/* Members Search & Selection */}
        <div>
          <label htmlFor="search-members" className="block text-sm font-medium text-gray-600">البحث عن الأعضاء</label>
          <input
            type="text"
            id="search-members"
            placeholder="ابحث عن الأعضاء..."
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto mt-4">
            {filteredUsers.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition duration-200"
              >
                <input
                  type="checkbox"
                  value={user.id}
                  className="checkbox checkbox-primary"
                  checked={teamMemberIds.includes(user.id)}
                  onChange={(e) => {
                    const id = e.target.value;
                    setTeamMemberIds((prev) =>
                      prev.includes(id)
                        ? prev.filter((uid) => uid !== id)
                        : [...prev, id]
                    );
                  }}
                />
                <img
                  src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="badge badge-outline badge-sm">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutationLoading}
          className="w-full py-3 bg-[#000] text-white rounded-lg shadow-lg hover:bg-[#333] transition-colors duration-200 disabled:opacity-50"
        >
          {mutationLoading ? "جاري إضافة الأعضاء..." : "إضافة الأعضاء"}
        </button>
      </form>
    </div>
  );
}
