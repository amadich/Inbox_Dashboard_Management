"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation"; // Changed from 'useParams' of 'react-router-dom' to Next.js
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import ShadingImage from "@/assets/images/shading.png";
import Snowflakes from "@/components/Snowflakes";
import LoadingShow from "@/components/LoadingShow";

const GET_FOR_PROFILE_PROJECTS = gql`
  query GetForProfileProjects {
    projects {
      id
      title
      description
      status
      color
      startDate
      endDate
      teamMembers {
        id
        firstName
        lastName
        email
        role
        status
        birthDate
      }
    }
  }
`;

interface DecodedToken {
  id: string;
  [key: string]: any;
}

const ProfileID = () => {
  const router = useRouter();
  const { id: userId } = useParams(); // Get ID from the URL params

  const { data, loading, error } = useQuery(GET_FOR_PROFILE_PROJECTS);

  // If userId isn't found in the params, show a message
  if (!userId) {
    return <p className="text-center mt-10">معرف المستخدم مفقود في الرابط</p>;
  }

  useEffect(() => {
    // If needed, you can add a fallback or logic here for invalid IDs, but we'll assume the ID is valid for now
  }, [userId]);

  if (loading) return <LoadingShow msg="جاري تحميل ملفك الشخصي..." />;
  if (error) return <p className="text-red-500 text-center mt-10">خطأ: {error.message}</p>;

  // Find the current user data from the teamMembers
  const allMembers = data.projects.flatMap((p: any) => p.teamMembers);
  const currentUser = allMembers.find((m: any) => m.id === userId);

  if (!currentUser) {
    return <LoadingShow msg="لم يتم العثور على المستخدم في أي مشروع" />;
  }

  const userProjects = data.projects.filter((project: any) =>
    project.teamMembers.some((member: any) => member.id === userId)
  );

  return (
    <>
      <Snowflakes />
      <div className="mx-auto p-6">
        {/* Profile Banner */}
        <div
          className="bg-gradient-to-r from-indigo-500 to-indigo-400 p-8 rounded-xl flex items-center gap-6"
          style={{
            backgroundImage: `url(${ShadingImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            className="w-32 h-32 rounded-full shadow-lg ring-4 ring-white"
            src={`https://ui-avatars.com/api/?name=${currentUser?.firstName}+${currentUser?.lastName}&background=random`}
            alt="الصورة الرمزية"
          />
          <div className="text-black">
            <h2 className="text-3xl font-semibold">
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="badge bg-indigo-500 text-white">{currentUser?.role}</span>
              <span className="badge bg-gray-500 text-white">{currentUser?.status}</span>
              {currentUser?.birthDate && (
                <span className="badge bg-yellow-300 text-gray-800">
                  🎂 {new Date(currentUser.birthDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="mt-12">
          <div className="flex items-center justify-between ">
            <div>
              <h3 className="text-2xl font-semibold">
                مشاريعك <span className="text-indigo-700">الشخصية</span>
              </h3>
              <p className="text-gray-600">
                هنا قائمة المشاريع التي تشارك فيها حاليًا. انقر على المشروع لعرض المزيد من التفاصيل.
              </p>
            </div>

            <img
              src={SotetelLogo.src}
              alt="شعار سوتيتل"
              draggable="false"
              className="w-40 h-auto mr-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            {userProjects.length > 0 ? (
              userProjects.map((project: any) => (
                <div
                  key={project.id}
                  className="w-96 p-6 bg-[whitesmoke] shadow-lg rounded-lg border-l-8 cursor-pointer"
                  style={{ borderColor: project.color || "#4C6EF5" }}
                  onClick={() => router.push(`/Projects/${project.id}`)}
                >
                  <h4 className="text-xl font-semibold text-indigo-600">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                  <div className="text-xs text-gray-400 mt-4 flex gap-6">
                    <div className="flex items-center space-x-2">
                      <strong>الحالة:</strong> <span className="badge badge-sm">{project.status}</span>
                    </div>
                    <span>
                      <strong> 🗓 التواريخ:</strong> {new Date(project.startDate).toLocaleDateString()} → {" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">أنت لست جزءًا من أي مشروع حتى الآن.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileID;
