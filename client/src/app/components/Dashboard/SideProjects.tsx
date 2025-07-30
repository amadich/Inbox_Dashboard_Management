import { PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import imageAiHub from "@/assets/images/aihub.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface ProjectProps {
  id: string;
  title: string;
  color: string;
  endDate: string; // Keep endDate as string for now
  teamMembers: { id: string; email: string }[];
}

interface SideProjectsProps {
  projects: ProjectProps[];
}

// Function to format the date as "Dec 15, 2023"
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

export default function SideProjects({ projects }: SideProjectsProps) {

  const router = useRouter();

  const [showAll, setShowAll] = useState(false);


  const handleLoadMore = () => {
    setShowAll((prevState) => !prevState);
  };

  return (
    <div className="card w-60 ml-20 bg-[whitesmoke]">
      <div className="card-header flex items-center justify-around pt-5">
        <h4 className="card-title">المشاريع</h4>
        <button className="flex items-center border border-cyan-800 text-cyan-800 rounded-full p-1 pr-2 space-x-1 text-sm duration-150 hover:border-transparent hover:bg-cyan-700 hover:text-white hover:pr-5" onClick={() => router.push('/Projects/CreateProject')}>
          <PlusIcon className="w-4 h-4" />
          <p>جديد</p>
        </button>
      </div>

      <div className="card-body">
        {projects.slice(0, showAll ? projects.length : 4).map((project) => (
          <div key={project.id} className="flex items-center duration-150 hover:bg-cyan-200  rounded-xl cursor-pointer " onClick={() => router.push(`/Projects/${project.id}`)}>
            <Image
              src={imageAiHub}
              alt="AI Hub"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
              draggable={false}
            />
            {/* Use the project color as the background color */}
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h4 className="text-sm font-semibold">{project.title}</h4>
              <p className="text-xs text-gray-500">
                تاريخ الاستحقاق: {formatDate(project.endDate)}
              </p>
            </div>
          </div>
        ))}

        {/* Only show the "Load more" button if there are more than 4 projects */}
        {projects.length > 4 && (
          <button
            className="flex items-center justify-center w-full text-cyan-950 text-sm mt-2"
            onClick={handleLoadMore}
          >
            <ChevronDownIcon
              className={`w-4 h-4 transform ${showAll ? 'rotate-180' : 'rotate-0'} transition duration-300`}
            />
            <span className="ml-2 text-xs">{showAll ? 'عرض أقل' : 'عرض المزيد'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
