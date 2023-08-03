import mongoose from "mongoose";

export interface CategoryProps {
    name: string;
    updatedAt?: Date;
    createdAt?: Date;
}

const catgorySchema = new mongoose.Schema<CategoryProps>({
    name: {
        type: String,
        required: true,
        unique: true,
    },

}, { timestamps: true });


const categoryModel = mongoose.model<CategoryProps>("users", catgorySchema)
export default categoryModel 