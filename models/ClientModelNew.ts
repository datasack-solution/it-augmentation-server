import mongoose, { Schema, Document } from "mongoose";

export interface TechnologyItem {
  tech: string;
  quantity: number;
}

export interface TransformedSkillsets {
  category: string;
  technologies: TechnologyItem[];
}

export interface SkillSet{
  skillset:TransformedSkillsets[]
}

export interface ClientDocument extends Document {
  industry: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  reason?: string;
  nda: boolean;
  arrSkillsets?: TransformedSkillsets[];
  duration?: string;
  city?: string;
  contactedChannel?: 'Call' | 'WhatsApp' | 'VoiceMail' | 'Email';
  responded?: boolean;
  isInterested?: boolean;
  remarks?: string;
}

const technologyItemSchema = new Schema<TechnologyItem>({
  tech: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const TransformedSkillsetsSchema = new Schema<TransformedSkillsets>({
  category: { type: String, required: true },
  technologies: { type: [technologyItemSchema], required: true },
});

const skillsetSchema = new Schema<SkillSet>({
  skillset:{ type: [TransformedSkillsetsSchema] }
})

const ClientSchema = new Schema<ClientDocument>({
  industry: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String },
  nda: { type: Boolean, required: true },
  arrSkillsets: { type: [skillsetSchema] },
  duration: { type: String },
  city: {
    type: String,
    required: false,
  },
  contactedChannel: {
    type: String,
    enum: ['Call', 'WhatsApp', 'VoiceMail', 'Email'],
    required: false,
  },
  responded: {
    type: Boolean,
    required: false,
  },
  isInterested: {
    type: Boolean,
    required: false,
  },
  remarks: {
    type: String,
    required: false,
  }
},{timestamps:true});

ClientSchema.index({ email: 1 }, { unique: true })

export const Client = mongoose.model<ClientDocument>("Client", ClientSchema);
