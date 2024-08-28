import mongoose, { Schema, Types } from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";

export interface userDocument extends mongoose.Document {
    _id: Types.ObjectId;
    username: string;
    mail: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 4
    },
    mail: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail]
    },
    password: {
        type: String,
        required: true,
        min: 8
    }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
    const user = this as unknown as userDocument;
    
    if(!user.isModified('password')) {
        return next()    
    }

    const salt = await bcrypt.genSalt(7);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    let user = this as userDocument;
    return bcrypt.compare(candidatePassword, user.password).catch(e => false);
}

export const userModel = mongoose.model<userDocument>('userModel', userSchema);