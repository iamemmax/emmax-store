import mongoose from "mongoose";

export interface ReqUser extends UserProps {
    user: any // or any other type
}

export type rolesProps = ['admin' | 'user' | 'merchant']
export interface UserProps extends mongoose.Document {
    userId?: string
    firstname: string;
    email: string;
    username: string;
    lastname?: string;
    password: string;
    roles: rolesProps;
    verified: boolean;
    token: number;
    phone: string;
    updatedAt?: Date;
    createdAt?: Date;
}
const userSchema = new mongoose.Schema<UserProps>({
    userId: {
        type: String,
        // default: () => `userId_${uuidv4()}`
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
    },
    roles: {
        type: [],
        default: ["user"]
    },
    phone: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        trim: true,
    },
    token: {
        type: Number,
        expires: "30min"
    },
    verified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})
const userModel = mongoose.model<UserProps>("users", userSchema)
export default userModel