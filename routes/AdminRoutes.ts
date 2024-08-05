import { Router } from 'express';
import AdminController from '../controllers/adminController';
import { authenticateJWT } from '../util/verifyAuth';

const router: Router = Router();

router.post('/signup-email', AdminController.signUpEmail);  
router.post('/signin-email', AdminController.signInEmail);
router.post('/auth-user',authenticateJWT, AdminController.authUser);
router.post('/send-otp', AdminController.sendOTP);
router.post('/verify-otp', AdminController.verifyOTP);
router.put('/update-user',AdminController.updateUser);
router.put('/reset-password', AdminController.resetPassword);
router.delete('/delete-user/:email',AdminController.deleteUser)
router.get('/get-users',AdminController.getUsers)

export default router;
