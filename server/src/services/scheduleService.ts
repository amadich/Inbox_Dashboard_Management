import Schedule from "../models/ScheduleModel";

export const getAllSchedulesByProjectId = async (projectId: string) => {
  return await Schedule.findAll({ where: { projectId } });
};

export const getScheduleById = async (id: string) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new Error("Schedule not found");
  return schedule;
};

export const createSchedule = async (scheduleData: any) => {
  return await Schedule.create(scheduleData);
};

export const updateSchedule = async (id: string, scheduleData: any) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new Error("Schedule not found");
  await schedule.update(scheduleData);
  return schedule;
};

export const updateScheduleDay = async (id: string, day: string) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new Error("Schedule not found");
  await schedule.update({ day });
  return schedule;
};

export const deleteSchedule = async (id: string) => {
  const schedule = await Schedule.findByPk(id);
  if (!schedule) throw new Error("Schedule not found");
  await schedule.destroy();
  return "Schedule deleted successfully";
};