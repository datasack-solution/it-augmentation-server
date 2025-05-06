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


interface BrowserInfo{
  userAgent: string;
  platform: string;
  language: string;
}

export interface TrackingData {
  country?: string;
  city?: string;
  region?:string;
  location?:string;
  postal?:string;
  visitDate: Date;
  page: string;
  browserInfo: BrowserInfo,
  scrollPercent: number;
  sessionDuration: number; // in milliseconds
  clickEvents: string[];   // Array of clicked element labels
}


const browserInfoSchema = new Schema<BrowserInfo>({
  userAgent:{ type: String, required: true },
  platform:{ type: String, required: true },
  language:{ type: String, required: true },
})


const trackingSchema = new Schema<TrackingData>({
  country: { type: String, required: false },
  city: { type: String, required: false },
  region: { type: String, required: false },
  location: { type: String, required: false },
  postal: { type: String, required: false },
  visitDate: {type: Date, required: true},
  browserInfo: browserInfoSchema,
  scrollPercent: {type: Number,required: true},
  sessionDuration: {type: Number,required: true},
  clickEvents: [{type:String, required:false}]
});


export const TrackingDetailModel = mongoose.model<TrackingData>("TrackingData", trackingSchema);
