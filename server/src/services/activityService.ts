import Activity, { ActionType, EntityType } from "../models/activityModel";
import User from "../models/userModel";

export const getAllActivities = async () => {
  try {
    return await Activity.findAll({ 
      include: [{
        model: User,
        association: Activity.associations.user,
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['timestamp', 'DESC']]
    });
  } catch (error) {
    console.error('Error in getAllActivities:', error);
    throw new Error(`Failed to fetch activities: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getActivitiesByUser = async (userId: string) => {
  return await Activity.findAll({
    where: { userId },
    include: [User],
  });
};

export const getActivitiesByEntity = async (
  entityType: EntityType,
  entityId: string
) => {
  return await Activity.findAll({
    where: { entityType, entityId },
    include: [User],
  });
};

export const createActivity = async (data: {
  userId: string;
  actionType: ActionType;
  entityType: EntityType;
  entityId: string;
  details?: object;
}) => {
  return await Activity.create(data);
};