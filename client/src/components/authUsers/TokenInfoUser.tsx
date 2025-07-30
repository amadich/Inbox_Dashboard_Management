'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const TokenInfoUser = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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

  return userInfo;
};
