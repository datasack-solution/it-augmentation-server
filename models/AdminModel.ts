import { Document } from 'mongoose'
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt'


export interface AdminModel extends Document {
  userName:string;
    email: string;
    password: string;
}

export const AdminSchema = new Schema({
  userName:{ type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})


AdminSchema.pre('save', async function(next) {
    if (this.isModified('password')) { 
      this.password = await bcrypt.hash(this.password ||'', 12);
    }
    next();
  });



export default mongoose.model<AdminModel>('Admin', AdminSchema);
