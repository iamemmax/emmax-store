import mongoose from "mongoose";

export interface ReqUser extends UserProps {
    user: any // or any other type
}

// type rolesProps = 'admin' | 'user' | 'merchant'
export interface UserProps {
    userId?: string
    firstname: string;
    email: string;
    lastname?: string;
    password: string;
    roles: 'admin' | 'user' | 'merchant';
    verified: boolean;
    token: number;
    phone: number;
    updatedAt?: Date;
    createdAt?: Date;
}
const userSchema = new mongoose.Schema<UserProps>({
    userId: {
        type: String,
        // default: () => `userId_${uuidv4()}`
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
    },
    roles: {
        type: String,
        default: "user"
    },
    phone: {
        type: Number,
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