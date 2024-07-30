import bcrypt from 'bcrypt';
import jwt, { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../util/sendEmail';
import { AdminModel } from '../models/AdminModel';
import userRepo from '../repo/adminRepo';
import createJSONWebToken from '../util/auth';
import { DBErrCredentialsMismatch, DBErrInternal, DBErrOTPUserSignedUpByEmail, DBErrTokenExpired, DBErrUserAlreadyExist, DBErrUserNotFound } from '../util/handleErrors';
require("dotenv").config();

export interface JwtPayload extends BaseJwtPayload {
  id?: string;
}

interface UserServiceImplementation{
    SignUp:(user:AdminModel)=>Promise<{ user: AdminModel; token: string }>,
    SignIn:(email:string,password:string)=>Promise<{user:AdminModel;token:string}>
    AuthUser:(token:string)=>Promise<{user:AdminModel}>
    SendOTP:(email:string, accountVerification:boolean )=>Promise<{msg:string,otp:string}>
    UpdateUser:(email:string,userName:string,password:string)=>Promise<{user:AdminModel}>
    ResetPassword:(email:string,password:string)=>Promise<{user:AdminModel}>
  }

class UserService implements UserServiceImplementation {
    public async SignUp(userData: AdminModel): Promise<{ user: AdminModel; token: string }> {
        //find the exist one, 
        const existingUser =await userRepo.findOneByEmail(userData.email)
        if (existingUser){
          throw new DBErrUserAlreadyExist()
        }
    
        const newUser = await userRepo.SignUp(userData)
        const token = createJSONWebToken(newUser._id)
        return {user:newUser,token}
      }

 async SignIn(email: string, password: string): Promise<{ user: AdminModel; token: string; }>{
  //find the user by email
  const existingUser =await userRepo.findOneByEmail(email)
  if (!existingUser){
    throw new DBErrUserNotFound()
  }

  const isPasswordMatch = await bcrypt.compare(password,existingUser.password || '')

  if (!isPasswordMatch){
    throw new DBErrCredentialsMismatch()
  }

  //generate token
  const token = createJSONWebToken(existingUser._id)
  return {user:existingUser,token}
 }


 async AuthUser(token: string): Promise<{ user: AdminModel }> {
  const tokenKey = process.env.TOKEN_KEY || '';
  try {
    const decoded = jwt.verify(token, tokenKey) as JwtPayload; 
    const userId = decoded.id;
    if (!userId) {
      throw new DBErrUserNotFound();
    }
    const user = await userRepo.findOneById(userId);
    if (user) {
      return { user };
    } else {
      throw new DBErrUserNotFound();
    }
  } catch (err) {
    if (err instanceof DBErrTokenExpired) {
      throw new DBErrTokenExpired();
    } else {
      throw err;
    }
  }
}
async SendOTP(email:string,accountVerification:boolean):Promise<{msg:string,otp:string}>{
 
  const user= await userRepo.findOneByEmail(email)
  if (user){
    const otp = Math.floor(100000 + Math.random() * 900000) ;
    const onSendMail = await sendEmail(email,'Reset Your Password-OTP','',`Your OTP for resetting password is: ${otp}`)
  
    if (onSendMail.rejected.length!=0){
      throw new DBErrInternal("failed to send otp")
    }
    return {
      msg:"otp send successfully",
      otp:otp.toString()
    }
  }else{
    throw new DBErrUserNotFound()
  }
}

async UpdateUser(email:string,userName:string,password:string):Promise<{user:AdminModel}>{
  const hashedPassword = await bcrypt.hash(password, 12);

  const user =await userRepo.UpdateUser(email,userName,hashedPassword)
  
  if (!user){
    throw new DBErrUserNotFound()
  }

  return {user}
}

async ResetPassword(email:string,password:string):Promise<{user:AdminModel}>{
  const hashedPassword = await bcrypt.hash(password, 12);
  const user =await userRepo.ResetPassword(email,hashedPassword)
  
  if (!user){
    throw new DBErrUserNotFound()
  }

  return {user}
}
}

export default new UserService();

