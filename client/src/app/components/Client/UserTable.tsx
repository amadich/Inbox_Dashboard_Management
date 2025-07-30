"use client";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  role: string;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const router = useRouter();
  return (
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
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
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
                      user.status === 'FullTime'
                        ? 'text-green-600 bg-[#94fcae8e] shadow-green-500'
                        : user.status === 'PartTime'
                        ? 'bg-[#fae52a98] shadow-amber-400'
                        : user.status === 'Intern'
                        ? 'bg-[#8c77fc75] shadow-indigo-400'
                        : user.status === 'Freelancer'
                        ? 'bg-[#fc1fa05b] shadow-pink-400'
                        : ''
                    }`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.status === 'FullTime'
                          ? 'bg-green-500'
                          : user.status === 'PartTime'
                          ? 'bg-yellow-500'
                          : user.status === 'Intern'
                          ? 'bg-blue-500'
                          : user.status === 'Freelancer'
                          ? 'bg-red-500'
                          : ''
                      }`}
                    ></span>
                    <span>
                      {user.status === 'FullTime'
                        ? 'دوام كامل'
                        : user.status === 'PartTime'
                        ? 'دوام جزئي'
                        : user.status === 'Intern'
                        ? 'متدرب'
                        : user.status === 'Freelancer'
                        ? 'مستقل'
                        : ''}
                    </span>
                  </span>
                </td>

                <td>
                  <span
                    className={`badge space-x-2 text-xs font-medium select-none border-none shadow-none duration-150 hover:shadow-sm ${
                      user.role === 'ADMIN'
                        ? 'text-red-600 bg-red-100 shadow-red-500'
                        : user.role === 'MANAGER'
                        ? 'text-purple-600 bg-purple-100 shadow-purple-500'
                        : user.role === 'CLIENT'
                        ? 'text-gray-600 bg-gray-100 shadow-gray-500'
                        : user.role === 'TEAM'
                        ? 'text-cyan-600 bg-cyan-100 shadow-cyan-500'
                        : user.role === 'GUEST'
                        ? 'text-yellow-600 bg-yellow-100 shadow-yellow-500'
                        : 'text-gray-600 bg-gray-200 shadow-gray-500'
                    }`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-red-600'
                          : user.role === 'MANAGER'
                          ? 'bg-purple-600'
                          : user.role === 'CLIENT'
                          ? 'bg-gray-600'
                          : user.role === 'TEAM'
                          ? 'bg-cyan-600'
                          : user.role === 'GUEST'
                          ? 'bg-yellow-600'
                          : 'bg-gray-400'
                      }`}
                    ></span>
                    <span>
                      {user.role === 'ADMIN'
                        ? 'مدير'
                        : user.role === 'MANAGER'
                        ? 'مدير فريق'
                        : user.role === 'CLIENT'
                        ? 'عميل'
                        : user.role === 'TEAM'
                        ? 'فريق'
                        : user.role === 'GUEST'
                        ? 'زائر'
                        : ''}
                    </span>
                  </span>
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
  );
};

export default UserTable;
