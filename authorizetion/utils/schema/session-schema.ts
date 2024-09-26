import mongoose, { Schema, Types } from "mongoose";
import { userDocument } from './user-schema';

export interface sessionDocument extends mongoose.Document {
    _id: Types.ObjectId;
    user: userDocument;
    userAgent: string;
    valid: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    userAgent: {
        type: String,
        required: true,
    },
    valid: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })

export const sessionModel = mongoose.model<sessionDocument>('sessionModel', sessionSchema);