"use client";

import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { usePathname, useRouter } from "next/navigation";

const VERIFY_TOKEN_MUTATION = gql`
  mutation verifyUserToken($token: String!) {
    verifyToken(token: $token) {
      token
    }
  }
`;


const AuthProvider: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [verifyToken] = useMutation(VERIFY_TOKEN_MUTATION);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
         return false;
      }

      try {
        const response = await verifyToken({ variables: { token } });
        const newToken = response.data?.verifyToken?.token;

        if (newToken) {
          localStorage.setItem("token", newToken); // Update token with new one
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          return false;
        }
      } catch (error) {
        //console.error("Token verification failed:", error);
        setIsAuthenticated(false);        
         return false;
      }
    };

    verifyAuth();
  }, [pathname, router, verifyToken]); // Re-run on route change

  if (isAuthenticated === null) {
    return false;
  }

  return true;
};


export { AuthProvider } ;

