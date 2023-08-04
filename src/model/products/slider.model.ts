import mongoose, { Schema, InferSchemaType, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid"
export interface productSliderProps {

    title: string;
    productId: string;
    category: Types.ObjectId;
    img: string;
    postedBy: Types.ObjectId;
    updatedAt?: Date;
    createdAt?: Date;
}
const sliderSchema = new mongoose.Schema<productSliderProps>({
    title: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
        default: () => `productId_${uuidv4().slice(0, 8)}`
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    img: {
        required: true,
        type: String
    }
}, { timestamps: true })

// type sliderTypes = InferSchemaType<typeof sliderSchema>
const sliderModel = mongoose.model<productSliderProps>("productSliders", sliderSchema)
export default sliderModel