import Announcement from "../../models/announcementModel";
import User from "../../models/userModel";

interface AnnouncementInput {
  title: string;
  content: string;
  senderId: string;
  visibility: "all" | "specific";
  visibleTo?: string[];
}

interface AnnouncementType {
  id: string;
  title: string;
  content: string;
  senderId: string;
  visibility: "all" | "specific";
  visibleTo?: string[];
  createdAt?: string;
}

export const announcementResolvers = {
  Query: {
    announcements: async (): Promise<AnnouncementType[]> => {
      return await Announcement.findAll({ include: [User] });
    },
  },
  Mutation: {
    createAnnouncement: async (
      _: unknown,
      { input }: { input: AnnouncementInput }
    ): Promise<AnnouncementType> => {
      const announcement = await Announcement.create({
        title: input.title,
        content: input.content,
        senderId: input.senderId,
        visibility: input.visibility,
        visibleTo: input.visibleTo || null,
      });

      return announcement;
    },
  },
  Announcement: {
    sender: async (parent: AnnouncementType) => {
      return await User.findByPk(parent.senderId);
    },
  },
};
