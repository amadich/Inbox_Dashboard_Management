import User, { UserRole, UserStatus } from "../models/userModel";
import bcrypt from "bcrypt";
import { generateTokenSignup } from "../utils/jwtHelper";
import { verifyToken } from "../utils/jwtHelper";
import { createActivity } from "./activityService";
import { ActionType, EntityType } from "../models/activityModel";

interface UserInterface { userId: string , firstName: string; lastName: string; email: string; password: string; phoneNumber?: string; status?: UserStatus ; birthDate?: Date; role?: UserRole }
interface UserLogin { email: string; password: string }

export const getAllUsers = async () => {
   return await User.findAll({
      attributes: ["id","userId" ,"firstName", "lastName", "email", "phoneNumber", "status" , "birthDate", "role"],
   });
};

export const getUserById = async (id: string) => {
   return await User.findByPk(id, {
      attributes: ["id","userId" ,"firstName", "lastName", "email", "phoneNumber", "status" , "birthDate", "role"],
   });
};

export const createUser = async ({
   userId,
   firstName,
   lastName,
   email,
   password,
   phoneNumber,
   status = UserStatus.FullTime, // Default status is FullTime
   birthDate,
   role = UserRole.CLIENT, // Default role is CLIENT
   
   }: UserInterface) => {


   // Check if email already exists
   const existingUser = await User.findOne({ where: { email } });
   if (existingUser) throw new Error("Email already exists.");

   // Hash the password
   const hashedPassword = await bcrypt.hash(password, 10);

   // Create new user
   const newUser = await User.create({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      status,
      birthDate,
      role,
   });

   // Generate JWT token
   const token = generateTokenSignup({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      status: newUser.status,
      birthDate: newUser.birthDate,

   });
   
   // Create activity log for user creation
   await createActivity({
      userId: userId, // Replace with the ID of the user creating the new user
      actionType: ActionType.CREATE,
      entityType: EntityType.USER,
      entityId: newUser.id,
    });

   return { token };
};

export const loginUser = async ({ email, password }: UserLogin) => {
   
      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) throw new Error("Invalid email or password");

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) throw new Error("Invalid email or password");

      const token = generateTokenSignup({
         id: existingUser.id,
         firstName: existingUser.firstName,
         lastName: existingUser.lastName,
         email: existingUser.email,
         role: existingUser.role,
         phoneNumber: existingUser.phoneNumber,
         status: existingUser.status,
         birthDate: existingUser.birthDate,
      });

      // Create activity log for login
      await createActivity({
         userId: existingUser.id, // Replace with the ID of the user logging in
         actionType: ActionType.LOGIN,
         entityType: EntityType.USER,
         entityId: existingUser.id,
      });

      return { token };
  
}


export const verifyUserToken = async (token: string) => {
   
      const newToken = verifyToken(token);
      return newToken;
   
};


export const updateUser = async (input: {
   id: string;
   userId: string;
   firstName?: string;
   lastName?: string;
   email?: string;
   password?: string;
   phoneNumber?: string;
   status?: UserStatus;
   birthDate?: string;
   role?: UserRole;
 }) => {
   const user = await User.findByPk(input.id);
   if (!user) throw new Error("User not found");
 
   // Check email uniqueness
   if (input.email && input.email !== user.email) {
     const existingUser = await User.findOne({ where: { email: input.email } });
     if (existingUser) throw new Error("Email already exists");
     user.email = input.email;
   }
 
   // Check phone uniqueness
   if (input.phoneNumber && input.phoneNumber !== user.phoneNumber) {
     const existingUser = await User.findOne({ 
       where: { phoneNumber: input.phoneNumber } 
     });
     if (existingUser) throw new Error("Phone number already exists");
     user.phoneNumber = input.phoneNumber;
   }
 
   // Update fields
   if (input.firstName) user.firstName = input.firstName;
   if (input.lastName) user.lastName = input.lastName;
   if (input.status) user.status = input.status;
   if (input.birthDate) user.birthDate = new Date(input.birthDate);
   if (input.role) user.role = input.role;
 
   // Handle password update
   if (input.password) {
     user.password = await bcrypt.hash(input.password, 10);
   }
 
   await user.save();
 
   // Return user without sensitive data
   return await User.findByPk(input.id, {
     attributes: ["id", "userId", "firstName", "lastName", "email", 
       "phoneNumber", "status", "birthDate", "role"],
   });
 };