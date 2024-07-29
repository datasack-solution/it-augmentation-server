import { Router } from 'express';
import ClientController from '../controller/clientController';

const router = Router();

router.post('/clients', ClientController.create);
router.put('/clients/:email', ClientController.update);
router.delete('/clients/:email', ClientController.delete);
router.get('/clients', ClientController.getAll);

export default router;
