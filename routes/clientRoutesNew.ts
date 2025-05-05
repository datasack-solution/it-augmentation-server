import { Router } from 'express';
import ClientController from '../controllers/clientControllerNew';
import { TrackingData, TrackingDetailModel } from '../models/ClientModelNew';

const router = Router();

router.post('/clientsNew', ClientController.create);
router.put('/clientsNew/:email', ClientController.update);
router.delete('/clientsNew/:email', ClientController.delete);
router.get('/clientsNew', ClientController.getAll);


router.post('/tracking',async (req,res, next)=>{
    const data = req.body as TrackingData
    try{
       const tracking=  new TrackingDetailModel(data)
       await tracking.save()
       res.status(200).json({message:"user track details saved"})
    }catch(e){  
        res.status(400).json({message:"unable to track the user"})
        next()
    }
})


router.get('/tracking',async (req,res,next)=>{
    try{
        const tracks = await  TrackingDetailModel.find({})
        res.status(200).json({tracks,message:"successfully fetch user tracking details"})
    }catch(e){
        res.status(400).json({message:"unable to fetch tracking details"})
    }
})


export default router;
