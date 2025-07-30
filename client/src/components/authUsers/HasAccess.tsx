'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import SorryShow from '../SorryShow';
import { AuthProvider } from './AuthProvider';

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function HasAccess({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const authme = AuthProvider({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserInfo({
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role,
        });


      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  const hasAccess = authme && userInfo?.role === "MANAGER" || userInfo?.role === "ADMIN" 
      ? true 
      : false

  return (
    <>
      {
        hasAccess ? children : <SorryShow msg='This can only be accessed by the Administrator and Manager!!' />
      }
    </>
  );
}
