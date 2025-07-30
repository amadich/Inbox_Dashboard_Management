import { getAllUsers, getUserById, createUser , loginUser , verifyUserToken, updateUser } from "../../services/userService";
import { UserRole, UserStatus } from "../../models/userModel";
import { createActivity } from "../../services/activityService";
import { ActionType, EntityType } from "../../models/activityModel";

interface UserInterface {  userId: string , firstName: string; lastName: string; email: string; password: string; phoneNumber?: string; status?: UserStatus ; birthDate?: Date; role?: UserRole }
interface UserLogin { email: string; password: string }
interface UpdateUserInput {
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
}

export const userResolvers = {
  Query: {
    users: async () => {
      try {
        return await getAllUsers();
      } catch {
        throw new Error("Failed to fetch users");
      }
    },
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await getUserById(id);
        if (!user) throw new Error("User not found");
        return user;
      } catch {
        throw new Error("Failed to fetch user");
      }
    },
  },
  Mutation: {
    createUser: async (_: any,{ user }: { user: UserInterface }) => {
     
        return await createUser(user);
      
    },

    login: async (_: any, { user }: { user: UserLogin }) => {
      return await loginUser(user);
    },

    updateUser: async (_: any, { inputUpdate }: { inputUpdate: UpdateUserInput }) => {
      try {
        const updatedUser = await updateUser(inputUpdate);
        await createActivity({
          userId: inputUpdate.userId,
          actionType: ActionType.UPDATE,
          entityType: EntityType.USER,
          entityId: inputUpdate.id,
        });
        return updatedUser;
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },

    deleteUser: async (_: any, { inputDelete }: { inputDelete: { id: string; userId: string } }) => {
      const { id, userId } = inputDelete;
      try {
        const user = await getUserById(id);
        if (!user) throw new Error("User not found");
    
        await createActivity({
          userId: userId,
          actionType: ActionType.DELETE,
          entityType: EntityType.USER,
          entityId: user?.id,
        });
    
    
        await user.destroy();
        return user;
      } catch (error) {
        console.error("Error during user deletion:", error);
        throw new Error("Failed to delete user");
      }
    },    

    verifyToken: async (_: any, { token }: { token: string }) => {
      
        try {
          const newToken = verifyUserToken(token);
          return {
            token: newToken,
          };
        }
        catch (error) {
          throw new Error("Failed to verify token");
        }
      
    },



    
    
  },
};
