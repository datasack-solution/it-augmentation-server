import { Router } from 'express';
import ClientController from '../controllers/clientControllerNew';

const router = Router();

router.post('/clientsNew', ClientController.create);
router.put('/clientsNew/:email', ClientController.update);
router.delete('/clientsNew/:email', ClientController.delete);
router.get('/clientsNew', ClientController.getAll);

export default router;
