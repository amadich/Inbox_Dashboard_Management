"use client";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PROJECT_TEAM_MEMBERS } from "@/app/graphql/projectMutation";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface TeamMember {
  projectId: string;
  userId: string;
  teamName: string;
  user: {
    firstName: string;
    lastName: string;
  } | null;
  project: {
    title: string;
    status: string;
  } | null;
}

interface Team {
  projectId: string;
  userId: string;
  teamName: string;
  projectName: string;
  status: string;
  logo: string;
  firstName: string;
  lastName: string;
}

export default function TeamCollaboration() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_PROJECT_TEAM_MEMBERS);
  const [showAll, setShowAll] = useState(false);

  const handleLoadMore = () => {
    setShowAll((prevState) => !prevState);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading team members.</p>;

  // Transform server data to display format
  const teams: Team[] = data?.getAllProjectTeamMembers
    .filter((member: TeamMember) => member.user && member.project)
    .map((member: TeamMember) => ({
      projectId: member.projectId,
      userId: member.userId,
      teamName: member.teamName,
      projectName: member.project?.title ?? "Unknown Project",
      status: member.project?.status ?? "Inactive",
      logo: `https://ui-avatars.com/api/?name=${member.user?.firstName}+${member.user?.lastName}&background=random&bold=true`,
      firstName: member.user?.firstName ?? "",
      lastName: member.user?.lastName ?? "",
    }));

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-cyan-200 text-cyan-800";
      case "ON_HOLD":
        return "bg-yellow-200 text-yellow-800";
      case "COMPLETED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="card w-full bg-[whitesmoke] select-none">
      <div className="card-header flex items-center justify-around pt-5">
        <h4 className="card-title text-sm">تعاون الفريق</h4>
        <button
          className="flex items-center border border-cyan-800 text-cyan-800 rounded-full p-1 pr-2 space-x-1 text-xs duration-150 hover:border-transparent hover:bg-cyan-700 hover:text-white"
          onClick={() => router.push("/Records/Team")}
        >
          <PlusIcon className="w-4 h-4" />
          <p>إضافة عضو</p>
        </button>
      </div>

      <div className="card-body">
        {teams.slice(0, showAll ? teams.length : 4).map((team, index) => (
          <div key={index} className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="tooltip tooltip-bottom"
                data-tip={`${team.firstName} ${team.lastName}`}
              >
                <img
                  src={team.logo}
                  alt={`${team.teamName} logo`}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                  onClick={() => router.push(`/Profile/${team.userId}`)}
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{team.teamName}</h4>
                <p
                  className="text-xs text-gray-500 cursor-pointer duration-150 hover:text-cyan-700"
                  onClick={() => router.push(`/Projects/${team.projectId}`)}
                >
                  يعمل على: {team.projectName}
                </p>
              </div>
            </div>

            <div>
              <span
                className={`inline-block px-2 py-1 text-[10px] font-semibold rounded-full mt-1 ${getStatusClass(team.status)}`}
              >
                {team.status}
              </span>
            </div>
          </div>
        ))}

        {teams.length > 4 && (
          <button
            className="flex items-center justify-center w-full text-cyan-950 mt-2"
            onClick={handleLoadMore}
          >
            <ChevronDownIcon
              className={`w-4 h-4 transform ${showAll ? "rotate-180" : "rotate-0"} transition duration-300`}
            />
            <span className="ml-2 text-xs">
              {showAll ? "عرض أقل" : "عرض المزيد"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
