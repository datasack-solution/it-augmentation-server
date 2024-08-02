import Client, { ClientModel, SkillSet } from '../models/ClientsModel';


class ClientRepository {
    async createOrUpdateClient(clientData: ClientModel):Promise<null> {
        try {
            let existingClient = await Client.findOne({
                $and: [{ email: clientData.email }, { phone: clientData.phone }]
            });
    
            if (existingClient) {
                existingClient.industry = clientData.industry;
                existingClient.name = clientData.name;
                existingClient.date = clientData.date;
                existingClient.requirements = clientData.requirements;
                existingClient.nda = clientData.nda;
                // appending new skills into it
                if (clientData.arrSkillsets && existingClient.arrSkillsets) {
                    existingClient.arrSkillsets = [
                        ...existingClient.arrSkillsets,
                        ...clientData.arrSkillsets
                    ];
                } else if (clientData.arrSkillsets) {
                    existingClient.arrSkillsets = clientData.arrSkillsets;
                }                
                await existingClient.save();
                return null
            } 
            existingClient = await Client.findOne({ email: clientData.email });
            if (existingClient) {
                existingClient.phone = clientData.phone;
                existingClient.industry = clientData.industry;
                existingClient.name = clientData.name;
                existingClient.date = clientData.date;
                existingClient.requirements = clientData.requirements;
                existingClient.nda = clientData.nda;
                // existingClient.arrSkillsets = clientData.arrSkillsets;
                if (clientData.arrSkillsets && existingClient.arrSkillsets) {
                    existingClient.arrSkillsets = [
                        ...existingClient.arrSkillsets,
                        ...clientData.arrSkillsets
                    ];
                } else if (clientData.arrSkillsets) {
                    existingClient.arrSkillsets = clientData.arrSkillsets;
                }   
    
                await existingClient.save();
                return null;
            }
            const newClient = new Client(clientData);
            await newClient.save();
            return null
        } catch (error) {
            console.error('Error creating/updating client:', error);
        }
        return null
    };

    async update(email: string, clientData: Partial<ClientModel>): Promise<ClientModel | null> {
        return await Client.findOneAndUpdate({ email }, clientData, { new: true });
    }

    async delete(email: string): Promise<ClientModel | null> {
        return await Client.findOneAndDelete({ email });
    }

    async getAll(): Promise<ClientModel[]> {
        return await Client.find();
    }
}

export default new ClientRepository();
