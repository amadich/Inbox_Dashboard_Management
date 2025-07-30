// components/Team/TeamList.tsx

import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

interface TeamListProps {
  teamMembers: TeamMember[];
}

const TeamList: React.FC<TeamListProps> = ({ teamMembers }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link href={`/team/edit/${member.id}`} className="text-blue-500 hover:text-blue-700">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamList;
