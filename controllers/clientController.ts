import { Request, Response } from 'express';
import ClientRepository from '../repo/clientRepo';
import {  ClientModel, SkillSet, TechnologyItem } from '../models/ClientsModel';
import { convertRawItemsToBackendStructure } from '../util/helper';

class ClientController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const clientData = req.body
            const predefinedData: { [key: string]: number } = clientData.skillsets?.predefinedTechData || {}
            const customSkillData: TechnologyItem[] = clientData.skillsets?.customTechsData || []

            const skillsets:SkillSet = convertRawItemsToBackendStructure(predefinedData, customSkillData)
            
            //convert this to arrSkillsets for db conversion
            const arrSkillsets:SkillSet[]=[]
            arrSkillsets.push(skillsets)

            const clientReqData: ClientModel = { ...clientData, arrSkillsets }
            const client = await ClientRepository.createOrUpdateClient(clientReqData);
            res.status(201).json(client);
        } catch (error) {
            res.status(400).json({ message: 'Error creating client', error });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params.email;
            const clientData: Partial<ClientModel> = req.body;
            const updatedClient = await ClientRepository.update(email, clientData);
            if (!updatedClient) {
                res.status(404).json({ message: 'Client not found' });
            } else {
                res.status(200).json(updatedClient);
            }
        } catch (error) {
            res.status(400).json({ message: 'Error updating client', error });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params.email;
            const deletedClient = await ClientRepository.delete(email);
            if (!deletedClient) {
                res.status(404).json({ message: 'Client not found' });
            } else {
                res.status(204).send();
            }
        } catch (error) {
            res.status(400).json({ message: 'Error deleting client', error });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const clients = await ClientRepository.getAll();
            res.status(200).json(clients);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching clients', error });
        }
    }
}

export default new ClientController();
