import { ContactService } from '../../services/userContactService';
const contactService = new ContactService();

export const userContactResolvers = {
  
  Query: {
    getAllContacts: () => contactService.getAllContacts(),
    getContactById: (_: any, { id }: { id: number }) => contactService.getContactById(id),
    getContactsByPriority: (_: any, { priority }: { priority: 'A+' | 'A' | 'B' | 'C' }) => 
      contactService.getContactsByPriority(priority)
  },

  Mutation: {
    createContact: (_: any, { input }: { input: any }) => contactService.createContact(input),
    updateContact: (_: any, { id, input }: { id: number, input: any }) => 
      contactService.updateContact(id, input),
    deleteContact: (_: any, { id }: { id: number }) => contactService.deleteContact(id)
  }
};