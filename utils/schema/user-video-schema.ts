import mongoose, { Schema, Types } from "mongoose";
import { userDocument } from './user-schema';

export interface videoDocument extends mongoose.Document {
    _id: Types.ObjectId;
    user: userDocument;
    description: string;
    title: string;
    videoId: string;
    extension: string;
    createdAt: Date;
    updatedAt: Date;
}

const videoSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    description: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    videoId: {
        type: String,
        required: true
    },
    extension: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const videoModel = mongoose.model<videoDocument>('videoModel', videoSchema);