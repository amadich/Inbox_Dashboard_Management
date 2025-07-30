'use client';

import { useQuery } from '@apollo/client';
import { GET_ACTIVITIES } from '@/app/graphql/activitiesQueries';
import { format, isValid } from 'date-fns';
import { UserPlusIcon, UserMinusIcon, FolderPlusIcon, FolderMinusIcon } from '@heroicons/react/24/outline';
import SotetelLogo from "@/assets/images/sotetel_logo.png";

interface ActivityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Activity {
  id: string;
  actionType: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  timestamp: string;
  user?: ActivityUser;
}

const formatDateSafe = (dateString: string) => {
  try {
    if (/^\d{13}$/.test(dateString)) {
      const date = new Date(Number(dateString));
      if (isValid(date)) {
        return {
          formattedDate: format(date, 'MMM dd, yyyy'),
          formattedTime: format(date, 'HH:mm:ss'),
          isValid: true,
        };
      }
    }

    const postgresFormatRegex = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})(\.\d+)?([+-]\d{2})?/;
    const matches = dateString.match(postgresFormatRegex);

    if (matches) {
      const [, datePart, timePart, milliseconds, timezone] = matches;
      const timezoneFormatted = timezone ? 
        `${timezone.slice(0, 3)}:${timezone.slice(3) || '00'}` : 
        '+00:00';
      const isoString = `${datePart}T${timePart}${milliseconds || ''}${timezoneFormatted}`;
      const date = new Date(isoString);

      if (isValid(date)) {
        return {
          formattedDate: format(date, 'MMM dd, yyyy'),
          formattedTime: format(date, 'HH:mm:ss'),
          isValid: true,
        };
      }
    }

    const date = new Date(dateString);
    if (isValid(date)) {
      return {
        formattedDate: format(date, 'MMM dd, yyyy'),
        formattedTime: format(date, 'HH:mm:ss'),
        isValid: true,
      };
    }

    throw new Error('Unrecognized date format');
  } catch (error: any) {
    console.error('Date parsing error:', error.message, 'Original:', dateString);
    return {
      formattedDate: 'N/A',
      formattedTime: 'N/A',
      isValid: false,
    };
  }
};

export default function ActivitiesPage() {
  const { loading, error, data } = useQuery<{ activities: Activity[] }>(GET_ACTIVITIES);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  if (error) return (
    <div className="alert alert-error m-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>خطأ في تحميل الأنشطة: {error.message}</span>
    </div>
  );

  const getActionBadge = (actionType: string) => {
    const baseClass = 'badge badge-sm flex items-center gap-1';
    switch (actionType) {
      case 'CREATE': return <div className={`${baseClass} bg-[#40d8455d]`}>
        <FolderPlusIcon className="h-4 w-4" />
        {actionType}
      </div>;
      case 'UPDATE': return <div className={`${baseClass} bg-[#f1e53596]`}>
        <FolderMinusIcon className="h-4 w-4" />
        {actionType}
      </div>;
      case 'DELETE': return <div className={`${baseClass} bg-[#d840875d]`}>
        <UserMinusIcon className="h-4 w-4" />
        {actionType}
      </div>;
      case 'LOGIN': return <div className={`${baseClass} bg-[#4240d85d] text-purple-900`}>
        <UserPlusIcon className="h-4 w-4" />
        {actionType}
      </div>;
      case 'ADD_TEAM_MEMBER': return <div className={`${baseClass} badge-primary`}>
        <UserPlusIcon className="h-4 w-4" />
        {actionType}
      </div>;
      case 'REMOVE_TEAM_MEMBER': return <div className={`${baseClass} badge-secondary`}>
        <UserMinusIcon className="h-4 w-4" />
        {actionType}
      </div>;
      default: return <div className={`${baseClass} badge-neutral`}>{actionType}</div>;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'USER': return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
      case 'PROJECT': return <FolderPlusIcon className="h-5 w-5 text-green-600" />;
      default: return <span className="text-xl">📝</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      <div>
         <div className="flex items-center gap-2 mb-4">
            <img src={SotetelLogo.src} alt="Sotetel Logo" className="w-28" />
            <h1 className="text-3xl font-bold text-blue-600">الأنشطة</h1>
         </div>
         <p className="text-gray-600 mt-[-10px] ml-2">هنا الأنشطة الموجودة في النظام.</p>
      </div>
      
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>الإجراء</th>
              <th>الكيان</th>
              <th>التفاصيل</th>
              <th>المستخدم</th>
              <th>الطابع الزمني</th>
            </tr>
          </thead>
          <tbody>
            {data?.activities.map((activity) => {
              const { formattedDate, formattedTime, isValid } = formatDateSafe(activity.timestamp);
              
              return (
                <tr key={activity.id}>
                  <td>
                    {getActionBadge(activity.actionType)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getEntityIcon(activity.entityType)}
                      {activity.entityType}
                    </div>
                  </td>
                  <td>
                    {activity.details ? (
                      <div className="flex flex-col gap-1">
                        {Object.entries(activity.details).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="font-semibold">{key}:</span>
                            <span className="text-neutral-500">
                              {typeof value === 'object' 
                                ? JSON.stringify(value) 
                                : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-neutral-400">{activity.entityId}</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className={`rounded-full w-6 ${
                          activity.user ? 'bg-black text-white' : 'bg-gray-200'
                        }`}>
                          <span>
                            {activity.user?.firstName?.[0] ?? '?'}
                            
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {activity.user?.firstName && activity.user?.lastName 
                            ? `${activity.user.firstName} ${activity.user.lastName}`
                            : <span className="text-gray-500">Deleted User</span>}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {activity.user?.email ?? 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                  <div className="flex flex-col">
                      <span className={`font-medium ${!isValid ? 'text-error' : ''}`}>
                        {formattedDate}
                      </span>
                      <span className={`text-sm ${!isValid ? 'text-error' : 'text-neutral-500'}`}>
                        {formattedTime}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!data?.activities.length && (
        <div className="alert alert-info mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>لا توجد أنشطة في النظام</span>
        </div>
      )}
    </div>
  );
}
