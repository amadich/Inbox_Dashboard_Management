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
import { revenueTypeDefs } from "./typeDefs/revenueTypeDefs";
import { revenueResolvers } from "./resolvers/revenueResolvers";
import { expenseTypeDefs } from "./typeDefs/expenseTypeDefs";
import { expenseResolvers } from "./resolvers/expenseResolvers";
import { profitTypeDefs } from "./typeDefs/profitTypeDefs";
import { profitResolvers } from "./resolvers/profitResolvers";
import { payrollTypeDefs } from "./typeDefs/payrollTypeDefs";
import { payrollResolvers } from "./resolvers/payrollResolvers";
import { userContactTypeDefs } from "./typeDefs/userContactTypedefs";
import { userContactResolvers } from "./resolvers/userContactResolvers";

export const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs , taskTypeDefs , projectTypeDefs , announcementTypeDefs , scheduleTypeDefs , activityTypeDefs, revenueTypeDefs, expenseTypeDefs, profitTypeDefs, payrollTypeDefs, userContactTypeDefs],
  resolvers: [userResolvers , taskResolvers , projectResolvers , announcementResolvers , scheduleResolvers , activityResolvers, revenueResolvers, expenseResolvers, profitResolvers, payrollResolvers, userContactResolvers],
});
