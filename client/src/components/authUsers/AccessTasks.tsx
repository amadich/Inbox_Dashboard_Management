'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from '@apollo/client';
import { GET_PROJECT_ID } from '@/app/graphql/projectMutation';
import SorryShow from '../SorryShow';
import LoadingShow from '@/components/LoadingShow';

import { AuthProvider } from './AuthProvider';

interface UserInfo {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface TeamMember {
  id: string;
}

export default function AccessTasks({ children, projectId }: { children: React.ReactNode; projectId: string }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const authme = AuthProvider({});

  // Fetch project details
  const { data, loading, error } = useQuery(GET_PROJECT_ID, {
    variables: { projectId },
  });

  // Decode user info from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserInfo({
          id: decoded.id,
          role: decoded.role,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, []);

  // Show login prompt if no user info
  if (!userInfo) {
    return <SorryShow msg="You must be logged in to access this page." />;
  }

  // Show loading while fetching project data
  if (loading) {
    return <LoadingShow msg="Verifying project access..." />;
  }

  // Handle project fetch errors
  if (error) {
    return <SorryShow msg="Failed to verify project access. Please try again later." />;
  }

  // Check access conditions
  const isAdminOrManager = userInfo.role === 'ADMIN' || userInfo.role === 'MANAGER';
  const isTeamMember = data?.project?.teamMembers?.some(
    (member: TeamMember) => member.id === userInfo.id
  );
  
  const hasAccess = authme && isAdminOrManager || isTeamMember;

  return (
    <>
      {hasAccess ? (
        children
      ) : (
        <SorryShow msg="Access restricted: You must be part of the project team or an administrator to view these tasks." />
      )}
    </>
  );
}
