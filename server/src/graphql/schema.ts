import { makeExecutableSchema } from "@graphql-tools/schema";
import { userTypeDefs } from "./typeDefs/userTypeDefs";
import { userResolvers } from "./resolvers/userResolver";
import { taskTypeDefs } from "./typeDefs/taskTypeDefs";
import { taskResolvers } from "./resolvers/taskResolver";
import { projectTypeDefs } from "./typeDefs/projectTypeDefs";
import { projectResolvers } from "./resolvers/projectResolvers";
import { announcementTypeDefs } from "./typeDefs/announcementTypeDefs";
import { announcementResolvers } from "./resolvers/announcementResolvers";
import { scheduleTypeDefs } from "./typeDefs/scheduleTypeDefs";
import { scheduleResolvers } from "./resolvers/scheduleResolver";
import { activityTypeDefs } from "./typeDefs/activityTypeDefs";
import { activityResolvers } from "./resolvers/activityResolver";

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs , taskTypeDefs , projectTypeDefs , announcementTypeDefs , scheduleTypeDefs , activityTypeDefs],
  resolvers: [userResolvers , taskResolvers , projectResolvers , announcementResolvers , scheduleResolvers , activityResolvers],
});
