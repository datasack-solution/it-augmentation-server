import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongodb'

export interface TechnologyItem {
    techName: string,
    quantity: number
}

export interface Subcategory {
    subcategory: string;
    items: TechnologyItem[];
}

export interface MainCategory {
    mainCategory: string;
    subcategories: Subcategory[];
}


export interface SkillSet {
    predefinedTechData: MainCategory[];
    customTechsData?: TechnologyItem[];
}

export interface ClientModel extends Document {
    industry: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    requirements: string;
    nda: boolean;
    skillsets?: SkillSet;
    city?: string;
    contactedChannel?: 'Call' | 'WhatsApp' | 'VoiceMail' | 'Email';
    responded?: boolean;
    isInterested?: boolean;
    remarks?: string;
}

const technologyItemSchema = new Schema({
    techName: { type: String, required: true },
    quantity: { type: Number, required: true }
})


const subcategorySchema = new Schema({
    subcategory: { type: String, required: true },
    items: { type: [technologyItemSchema], required: true },
});

const mainCategorySchema = new Schema({
    mainCategory: { type: String, required: true },
    subcategories: { type: [subcategorySchema], required: true },
});


const skillSetSchema = new Schema({
    predefinedTechData: { type: [mainCategorySchema], required: true },
    customTechsData: { type: [technologyItemSchema], required: false },
});

export const ClientSchema = new Schema({
    industry: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    phone: { type: String, required: true, unique: false },
    date: { type: String, required: true },
    requirements: { type: String, required: false },
    nda: { type: Boolean, required: true },
    skillsets: { type: skillSetSchema, required: false },
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
}, { timestamps: true });

export default mongoose.model<ClientModel>('Client', ClientSchema);


const sampleTechnologyArray: MainCategory[] = [
    {
        mainCategory: 'Development Technologies',
        subcategories: [
            {
                subcategory: 'Web',
                items: [{
                    techName: "HTML5",
                    quantity: 23
                }]
            },
            {
                subcategory: 'Mobile',
                items: [
                    {
                        techName: "XAMARIN",
                        quantity: 3
                    },
                    {
                        techName: "KOTLIN",
                        quantity: 2
                    }
                ]
            },
        ],
    },
    {
        mainCategory: 'Data Management and Analytics',
        subcategories: [
            {
                subcategory: 'Database',
                items: [{
                    techName:"MYSQL",
                    quantity:23
                }]
            },
            {
                subcategory: 'Analytics',
                items:[
                    {
                        techName:"POWER BI",
                        quantity:23
                    }
                ]
            },
        ],
    },
];

const sampleCustomTechsData: TechnologyItem[] = [
    { techName: 'T24', quantity: 1 },
];

export const skillsets: SkillSet = {
    predefinedTechData: sampleTechnologyArray,
    customTechsData: sampleCustomTechsData
}