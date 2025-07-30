import {
   getAllActivities,
   getActivitiesByUser,
   getActivitiesByEntity,
 } from "../../services/activityService";
 import { EntityType } from "../../models/activityModel";
 
 export const activityResolvers = {
  Query: {
    activities: async () => {
      try {
        return await getAllActivities();
      } catch (error) {
        console.error('Activity Query Error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch activities');
      }
    },
     activitiesByUser: async (_: any, { userId }: { userId: string }) => {
       try {
         return await getActivitiesByUser(userId);
       } catch {
         throw new Error("Failed to fetch activities by user");
       }
     },
     activitiesByEntity: async (
       _: any,
       { entityType, entityId }: { entityType: string; entityId: string }
     ) => {
       try {
         // Validate and cast entityType to the EntityType enum
         const entityTypeEnum = EntityType[entityType as keyof typeof EntityType];
 
         if (!entityTypeEnum) {
           throw new Error(`Invalid entityType: ${entityType}`);
         }
 
         return await getActivitiesByEntity(entityTypeEnum, entityId);
       } catch (error) {
         if (error instanceof Error) {
           throw new Error(error.message || "Failed to fetch activities by entity");
         } else {
           throw new Error("Failed to fetch activities by entity");
         }
       }
     },
   },
 };
 