import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  status?: string;
  birthDate?: Date;
}

export const generateTokenSignup = (user: UserPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      status: user.status,
      birthDate: user.birthDate,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};

export const verifyToken = (token: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    //console.log("Decoded token:", decoded);
    const newToken =  generateTokenSignup({
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      role: decoded.role,
      phoneNumber: decoded.phoneNumber,
      status: decoded.status,
      birthDate: decoded.birthDate,
    });
    //console.log("New token:", newToken);
    // Check if the token is expired
    // const isExpired = Date.now() >= decoded.exp * 1000;
    // if (isExpired) {
    //   throw new Error("Token has expired");
    // }
    // Check if the token is malformed
    // if (!decoded.id || !decoded.firstName || !decoded.lastName || !decoded.email) {
    //   throw new Error("Token is malformed");
    // }
    // Check if the token is valid
    if (!decoded.role || !decoded.phoneNumber || !decoded.status || !decoded.birthDate) {
      throw new Error("Token is invalid");
    }
    // Check if the token is not revoked
    // This is a placeholder for actual revocation logic
    // if (isRevoked(token)) {
    //   throw new Error("Token has been revoked");
    // }
    // Check if the token is not blacklisted
    // This is a placeholder for actual blacklisting logic
    // if (isBlacklisted(token)) {
    //   throw new Error("Token has been blacklisted");
    // }
    
    return newToken;
  
};

