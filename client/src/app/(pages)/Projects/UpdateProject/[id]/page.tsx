"use client";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { UPDATE_PROJECT, GET_PROJECT, GET_USERS } from "@/app/graphql/projectMutation";
import LoadingShow from "@/components/LoadingShow";
import Swal from "sweetalert2";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";
import { useParams, useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const UpdateProject = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#F5F5F5");
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [progress, setProgress] = useState(10);

  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");

  useEffect(() => {


    if (userInfo?.role === "ADMIN") {
      setUserId(ownerId);
    } else {
      setUserId(userInfo?.id || "");
    }

  }, [userInfo , ownerId]);

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { projectId: projectId },
    skip: !projectId,
  });

  const { data: usersData, loading: usersLoading, error } = useQuery(GET_USERS);

  const [updateProject] = useMutation(UPDATE_PROJECT);

  useEffect(() => {
    if (projectData?.project) {
      
      const project = projectData.project;
      setTitle(project.title);
      setOwnerId(project.userId);
      setDescription(project.description || "");
      setSelectedColor(project.color);
      setSelectedStatus(project.status);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setTeamMemberIds(project.teamMembers.map((member: User) => member.id));
      setProgress(project.progress || 10);
    }
  }, [projectData]);

  if (projectLoading || usersLoading) return <LoadingShow msg="Loading project data..." />;
  if (error) return <LoadingShow msg="Error loading data" />;

  const users = usersData?.users || [];
  const project = projectData?.project;

  const filteredUsers = users.filter(
    (user: User) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProject({
        variables: {
          project: {
            id: projectId,
            userId,
            title,
            description,
            status: selectedStatus,
            color: selectedColor,
            startDate,
            endDate,
            teamMemberIds,
          },
        },
      });
      Swal.fire({
        icon: "success",
        title: "تم تحديث المشروع بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        router.push("/Projects");
      }, 1000);
    } catch (error) {
      console.error("Error updating project", error);
      Swal.fire({
        icon: "error",
        title: "فشل التحديث",
        text: "فشل في تحديث المشروع",
      });
    }
  };

  const colorSwatches = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#6366F1", "#F5F5F5",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src={SotetelLogo} alt="Sotetel Logo" width={100} height={100} />
          <h2 className="text-3xl font-semibold text-blue-500">
            تحديث <span className="text-black">{project?.title}</span>
          </h2>
        </div>
        <button onClick={() => router.push("/Projects")} className="text-gray-600 hover:text-gray-900">
          <p className="flex items-center gap-2">
            <span>العودة إلى المشاريع</span> <ChevronRightIcon className="h-6 w-6" />
          </p>
        </button>
      </div>

      <form onSubmit={handleUpdateProject} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-600">عنوان المشروع</label>
            <input
              id="title"
              type="text"
              placeholder="New Dashboard Ideation"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">وصف المشروع</label>
            <textarea
              id="description"
              placeholder="Describe your project..."
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Date Picker Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-600">تاريخ البدء</label>
            <input
              type="date"
              id="start-date"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-600">تاريخ الانتهاء</label>
            <input
              type="date"
              id="end-date"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-800">اختر المظهر</label>
          <div className="mt-2 flex gap-2">
            {colorSwatches.map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-300 ${
                  selectedColor === color ? "border-2 border-black scale-110" : "border-transparent"
                }`}
                style={{
                  background: color, // Gradient color
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex flex-col gap-4">
          <div className="md:ml-[70%]">
            <label className="block text-sm font-medium text-gray-600">حالة المشروع</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {["ACTIVE", "COMPLETED", "ON_HOLD"].map((status) => (
                <span
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`badge cursor-pointer ${selectedStatus === status ? 'badge-success' : 'badge-outline'} hover:scale-110 transition-transform duration-200`}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          <div className="md:ml-[70%]">
            <label className="block text-sm font-medium text-gray-600">الأولوية</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {["LOW", "MEDIUM", "HIGH"].map((priority) => (
                <span
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={`badge cursor-pointer ${selectedPriority === priority ? 'badge-accent' : 'badge-outline'} hover:scale-110 transition-transform duration-200`}
                >
                  {priority}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <label className="block text-sm font-medium text-gray-600">تقدم المشروع</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{progress}%</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="mt-2 w-full h-2 bg-indigo-100 rounded-lg appearance-none focus:outline-none"
            />
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-lg">
            <div
              className="h-2 bg-indigo-600 rounded-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Members Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">الأعضاء</h4>
          <input
            type="text"
            placeholder="ابحث عن الأعضاء..."
            className="input input-bordered w-full mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredUsers.map((user: User) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  value={user.id}
                  className=" checkbox checkbox-xs checkbox-primary"
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
                <p className="font-medium">
                  <span>{user.firstName} {user.lastName}</span> <br />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </p>
                <span className="badge badge-outline badge-sm">{user.role}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#000] text-white rounded-lg shadow-lg hover:bg-[#333] transition-colors duration-200 disabled:opacity-50"
        >
          تحديث المشروع
        </button>
      </form>
    </div>
  );
};

export default UpdateProject;