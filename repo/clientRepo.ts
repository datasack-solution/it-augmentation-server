import Client, { ClientModel } from '../models/ClientsModel';

class ClientRepository {
    async createOrUpdateClient(clientData: ClientModel):Promise<null> {
        try {
            const existingClient = await Client.findOne({
                $and: [{ email: clientData.email }, { phone: clientData.phone }]
            });
    
            if (existingClient) {
                existingClient.industry = clientData.industry;
                existingClient.name = clientData.name;
                existingClient.date = clientData.date;
                existingClient.requirements = clientData.requirements;
                existingClient.nda = clientData.nda;
                existingClient.skillsets = clientData.skillsets
    
                await existingClient.save();
                return null
            } else {
                const newClient = new Client(clientData);
                const result = await newClient.save();
                return null
            }
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