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
    },
    updateRevenue: async (_: any, { id, input }: { id: string; input: any }) => {
      return RevenueService.updateRevenue(id, input);
    },
    deleteRevenue: async (_: any, { id }: { id: string }) => {
      return RevenueService.deleteRevenue(id);
    }
  }
};