import { UserContact } from '../models/UserContactsModel';

export class ContactService {
  async getAllContacts() {
    return await UserContact.findAll();
  }

  async getContactById(id: number) {
    return await UserContact.findByPk(id);
  }

  async getContactsByPriority(priority: 'A+' | 'A' | 'B' | 'C') {
    return await UserContact.findAll({ where: { priority } });
  }

  async createContact(input: any) {
    return await UserContact.create(input);
  }

  async updateContact(id: number, input: any) {
    const contact = await UserContact.findByPk(id);
    if (!contact) throw new Error('Contact not found');
    return await contact.update(input);
  }

  async deleteContact(id: number) {
    const contact = await UserContact.findByPk(id);
    if (!contact) throw new Error('Contact not found');
    await contact.destroy();
    return true;
  }
}