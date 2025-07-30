import {
   getAllSchedulesByProjectId,
   getScheduleById,
   createSchedule,
   updateSchedule,
   deleteSchedule,
   updateScheduleDay,
 } from "../../services/scheduleService";
 
 export const scheduleResolvers = {
   Query: {
     schedulesByProjectId: async (_: any, { projectId }: { projectId: string }) => {
       return await getAllSchedulesByProjectId(projectId);
     },
     schedule: async (_: any, { id }: { id: string }) => {
       return await getScheduleById(id);
     },
   },
   Mutation: {
     createSchedule: async (_: any, { schedule }: { schedule: any }) => {
       return await createSchedule(schedule);
     },
     updateSchedule: async (_: any, { id, schedule }: { id: string; schedule: any }) => {
       return await updateSchedule(id, schedule);
     },
     updateScheduleDay: async (_: any, { schedule }: { schedule: any }) => {
       return await updateScheduleDay(schedule.id, schedule.day);
     },
     deleteSchedule: async (_: any, { id }: { id: string }) => {
       return await deleteSchedule(id);
     },
   },
 };