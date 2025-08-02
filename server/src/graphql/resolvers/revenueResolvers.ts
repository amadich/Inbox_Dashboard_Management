import { RevenueService } from '../../services/revenueService';

export const revenueResolvers = {
  Query: {
    revenues: async (_: any, { filter }: { filter: any }) => {
      return RevenueService.getRevenues(filter);
    }
  },
  Mutation: {
    createRevenue: async (_: any, { input }: { input: any }) => {
      return RevenueService.createRevenue(input);
    }
  }
};