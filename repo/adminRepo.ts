import  AdminSchema, {  AdminModel, Role } from '../models/AdminModel';
import { MongoError } from 'mongodb';
import { DBErrInternal, DBErrUserAlreadyExist, DBErrUserNotFound } from '../util/handleErrors';


interface AdminRepo {
    findOneByEmail: (email: string) => Promise<AdminModel | null>;
    findOneById:(id:string)=>Promise<AdminModel | null>;
    SignUp: (user: AdminModel) => Promise<AdminModel>;
    UpdateUser:(email:string,userName:string,password:string,role:Role)=>Promise<AdminModel|null>;
    ResetPassword:(email:string,password:string)=>Promise<AdminModel|null>
    DeleteUser:(email:string)=>Promise<null>
    findAll:()=>Promise<AdminModel[]>
    isAdminExists:()=>Promise<{user:AdminModel|null,isExist:boolean}>
}

class AdminRepoClass implements AdminRepo {
    async findOneByEmail(email:string):Promise<AdminModel | null>{
        return await AdminSchema.findOne({$or:[{
            email
                }]})
    }

    async isAdminExists(): Promise<{user:AdminModel|null,isExist:boolean}> {
        const admin = await AdminSchema.findOne({ role:'admin' });
        return {
            isExist:admin !== null,
            user:admin
        }
      }

    async findAll():Promise<AdminModel[]>{
        return await AdminSchema.find({})
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

    async UpdateUser(email:string,userName:string,password:string,role:Role):Promise<AdminModel|null>{
        try{
            const gotUser= await AdminSchema.findOneAndUpdate({email},{
                userName,
                password,
                role
            })
            return gotUser
        }catch(e){
            throw new DBErrInternal('DB Error')
        }
    }

    async DeleteUser(email:string):Promise<null>{
        try{
            const gotUser= await AdminSchema.deleteOne({email})
            if (gotUser.deletedCount>0){
                return null
            }
            throw new DBErrUserNotFound()
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
