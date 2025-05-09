import {  AdminModel } from "../models/AdminModel";
import UserService from "../service/AdminService";
import {Request,Response,NextFunction} from 'express'
import { DBErrCredentialsMismatch, DBErrInternal, DBErrIsAdminExist, DBErrOTPUserSignedUpByEmail, DBErrTokenExpired, DBErrUserAlreadyExist, DBErrUserNotFound } from "../util/handleErrors";


let inMemoryOTP:Map<string,string>=new Map()

class UserController {
    public async signUpEmail(req: any, res: any): Promise<void> {
        const { userName, email, password,role } = req.body;
        try {
          const user: AdminModel = { userName, email, password,role } as AdminModel;
          
          const { user: newUser } = await UserService.SignUp(user);
      
          res.status(201).json({
            message: 'User Signed up Successfully',
            success: true,
            user: newUser,
          });
        } catch (err:any) {
          if (err instanceof DBErrUserAlreadyExist) {
            res.status(409).json({ message: err.name, success: false });
          } else if (err instanceof DBErrInternal) {
            res.status(500).json({ message: err.name, success: false });
          }else if (err instanceof DBErrIsAdminExist) {
            res.status(400).json({ message: err.name, success: false });
          } else {
            res.status(500).json({ message: 'An unexpected error occurred', success: false });
          }
        }
      }
    public async signInEmail(req:Request,res:Response,next:NextFunction):Promise<void>{
      const {email,password} = req.body
      try{
        const {user,token} = await UserService.SignIn(email,password);
        res.setHeader('Authorization', token).status(201).json({
          message: 'User Logged In up Successfully',
          success: true,
          user: user,
          token
        });

        next();
      }catch(err:any){
        if (err instanceof DBErrUserNotFound) {
          res.status(404).json({ message: err.name, success: false });
        } else if (err instanceof DBErrInternal) {
          res.status(500).json({ message: err.name, success: false });
        } else if (err instanceof DBErrCredentialsMismatch) {
          res.status(500).json({ message: err.name, success: false });
        }
        else {
          res.status(500).json({ message:  `An unexpected error occurred: ${err}`, success: false });
        }
      }
    }


    public async authUser(req:Request,res:Response,next:NextFunction):Promise<void>{
     try{
      const token = req.headers.authorization?.split(' ')[1];
      if (!token){
         res.status(401).json({message:"User Not Authorized",success:false})
        return
      }
      const {user}= await UserService.AuthUser(token)
        res.status(200).json({message:"successfully authorized",success:true,user})
      next();
     }catch(err:any){
      if (err instanceof DBErrTokenExpired){
        res.status(403).json({message: err.name, success:false})
      }else if (err instanceof DBErrInternal) {
        res.status(500).json({ message: err.name, success: false });
      } else {
        res.status(500).json({ message:  `An unexpected error occurred: ${err}`, success: false });
      }
     }
    }

    
    public async getUsers(req:Request,res:Response,next:NextFunction):Promise<void>{
      try{
       const users= await UserService.GetUsers()
         res.status(200).json({message:"successfully retrieved all users",success:true,users})
       next();
      }catch(err:any){
       if (err instanceof DBErrInternal) {
         res.status(500).json({ message: err.name, success: false });
       } else {
         res.status(500).json({ message:  `An unexpected error occurred: ${err}`, success: false });
       }
      }
     }


    public async sendOTP(req:Request,res:Response,next:NextFunction):Promise<void>{
      try{
        const { email, accountVerification } = req.body;
        const {msg,otp}= await UserService.SendOTP(email,accountVerification)
        inMemoryOTP.set(email,otp)
        res.status(200).json({message:msg,status:true})
        next();
      }catch(err:any){
       if (err instanceof DBErrOTPUserSignedUpByEmail){
         res.status(409).json({message: err.name, success:false})
       }else if (err instanceof DBErrInternal) {
         res.status(500).json({ message: err.name, success: false })
       }
      else if (err instanceof DBErrUserNotFound) {
        res.status(400).json({message:err.name,success:false})
      }
      else {
         res.status(500).json({ message:  `An unexpected error occurred: ${err}`, success: false });
       }
      }
     }

     public async verifyOTP(req:Request,res:Response):Promise<void>{
        const {email,otp}=req.body
        if (inMemoryOTP.get(email)==otp){
          res.status(200).json({message:"OTP Verification successfull",success:true})
          inMemoryOTP=new Map()
          return
        }else{
          res.status(400).json({message:"The OTP entered is incorrect",success:false})
          return
        }
     }

    public async updateUser(req:Request,res:Response):Promise<void>{
      try{
        const {userName,email,password, role}=req.body
        const {user} =await UserService.UpdateUser(email,userName,password,role)
        res.status(201).json({message:"successfully user profile updated",success:true,user})
      }catch(err:any){
        if (err instanceof DBErrUserNotFound){
          res.status(404).json({ message: err.name, success: false });
        }else if (err instanceof DBErrInternal) {
          res.status(500).json({ message: err.name, success: false });
        } else {
          res.status(500).json({ message: `An unexpected error occurred: ${err}`, success: false });
        }
      }
    }

    public async deleteUser(req:Request,res:Response):Promise<void>{
      try{
        const {email}=req.params
        await UserService.DeleteUser(email)
        res.status(201).json({message:"successfully user profile deleted",success:true})

      }catch(err:any){
        if (err instanceof DBErrUserNotFound){
          res.status(404).json({ message: err.name, success: false });
        }else if (err instanceof DBErrInternal) {
          res.status(500).json({ message: err.name, success: false });
        } else {
          res.status(500).json({ message: `An unexpected error occurred: ${err}`, success: false });
        }
      }
    }

    public async resetPassword(req:Request,res:Response):Promise<void>{
      try{
        const {email,password}=req.body
        const {user} =await UserService.ResetPassword(email,password)
        res.status(201).json({message:"successfully password resetted",success:true,user})
      }catch(err:any){
        if (err instanceof DBErrUserNotFound){
          res.status(404).json({ message: err.name, success: false });
        }else if (err instanceof DBErrInternal) {
          res.status(500).json({ message: err.name, success: false });
        } else {
          res.status(500).json({ message: `An unexpected error occurred: ${err}`, success: false });
        }
      }
    }
}

export default new UserController();