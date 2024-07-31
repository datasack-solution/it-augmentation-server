import { Router } from 'express';
import AdminController from '../controllers/adminController';

const router: Router = Router();

router.post('/signup-email', AdminController.signUpEmail);  
router.post('/signin-email', AdminController.signInEmail);
router.post('/auth-user', AdminController.authUser);
router.post('/send-otp', AdminController.sendOTP);
router.post('/verify-otp', AdminController.verifyOTP);
router.put('/update-user',AdminController.updateUser);
router.put('/reset-password', AdminController.resetPassword);
router.post('/signout', AdminController.signout);

export default router;
