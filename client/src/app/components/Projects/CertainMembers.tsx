"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_Users_PROJECTById } from "@/app/graphql/projectMutation";
import LoadingShow from "@/components/LoadingShow";

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

export default function CertainMembers({ projectId }: { projectId: string }) {
  const { loading, error, data } = useQuery(GET_Users_PROJECTById, {
    variables: { projectId: projectId },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <span className="loading loading-bars loading-xl "></span>;
  if (error) return <LoadingShow msg={`Error! ${error.message}`} />;

  if (!data) return null;
  const project: Project = data.project;
  const members = project.teamMembers;
  const visibleMembers = members.slice(0, 4);
  const remainingCount = members.length - visibleMembers.length;

  return (
    <>
      {/* Avatar Group */}
      <div
        className="avatar-group -space-x-2 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {visibleMembers.map((member) => (
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

        {remainingCount > 0 && (
          <div className="avatar avatar-placeholder">
            <div className="bg-slate-100 text-neutral-800 w-6">
              <span className="font-semibold">+{remainingCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* DaisyUI Modal */}
      {isModalOpen && (
        <>
           <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Team Members</h3>
              <div className="grid grid-cols-2 gap-4">
               {members.map((member) => (
                 <div key={member.id} className="flex items-center space-x-2">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                     <img
                       src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                       alt="Member"
                     />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">
                     {member.firstName} {member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                 </div>
               ))}
              </div>
              <div className="modal-action">
               <button className="btn" onClick={() => setIsModalOpen(false)}>
                 Close
               </button>
              </div>
            </div>
            {/* Background overlay */}
            <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
           </div>
        </>
      )}
      <div className="text-gray-600 text-sm uppercase duration-150 hover:text-black cursor-default" title="Project Name">{project.title}</div>
    </>
  );
}
