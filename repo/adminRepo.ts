import  AdminSchema, {  AdminModel } from '../models/AdminModel';
import { MongoError } from 'mongodb';
import { DBErrInternal, DBErrUserAlreadyExist } from '../util/handleErrors';


interface AdminRepo {
    findOneByEmail: (email: string) => Promise<AdminModel | null>;
    findOneById:(id:string)=>Promise<AdminModel | null>;
    SignUp: (user: AdminModel) => Promise<AdminModel>;
    UpdateUser:(email:string,userName:string,password:string)=>Promise<AdminModel|null>;
    ResetPassword:(email:string,password:string)=>Promise<AdminModel|null>
}

class AdminRepoClass implements AdminRepo {
    async findOneByEmail(email:string,googleId?:string):Promise<AdminModel | null>{
        return await AdminSchema.findOne({$or:[{
            email,
            googleId
        }]})
    }
    
    async findOneById(id:string):Promise<AdminModel | null>{
        return await AdminSchema.findById(id)
    }

    async SignUp(user: AdminModel): Promise<AdminModel> {
        try{
            const userDoc = await AdminSchema.create(user)
            return await userDoc.save()
        }catch(err:any){
            const e:MongoError=err
            if (e.code==11000){
                throw new DBErrUserAlreadyExist()
            }else{
                throw new DBErrInternal('DB Error')
            }
        }   
    }

    async UpdateUser(email:string,userName:string,password:string):Promise<AdminModel|null>{
        try{
            const gotUser= await AdminSchema.findOneAndUpdate({email},{
                userName,
                password,
            })
            return gotUser
        }catch(e){
            throw new DBErrInternal('DB Error')
        }
    }
    async ResetPassword(email:string,password:string):Promise<AdminModel|null>{
        try{
            const gotUser= await AdminSchema.findOneAndUpdate({email},{
               $set:{password}
            },{new:true})
            return gotUser
        }catch(e){
            throw new DBErrInternal('DB Error')
        }
    }
}

export default new AdminRepoClass()
