import mongoose, { Schema, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid"
import slugify from "slugify"


interface imgPros {
    img: string
}
export interface productReviewProps {
    userId: Types.ObjectId;
    review: number
    comment: string
    reviewDate: Date
}
export interface productsProps {
    productId: string;
    title: string;
    slug: string;
    brand: string;
    description: string;
    category: Types.ObjectId;
    productImgs: imgPros[];
    size: string[];
    colors: string[];
    price: number;
    quantity: number;
    sold: number;
    userId: Types.ObjectId;
    numReview: number;
    rating: number;
    updatedAt?: Date;
    createdAt?: Date;
    productReviews: productReviewProps[]
}

const productSchema = new mongoose.Schema<productsProps>({
    productId: {
        type: String,
        default: () => `productId_${uuidv4().slice(0, 8)}`
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        require: true,

    },

    productImgs: [],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true,
        trim: true,
    },
    size: {
        type: [],
        required: true
    },
    colors: {
        type: [],
        required: true
    },

    brand: {
        type: String,
        // required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    productReviews: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },

        review: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true,

        },
        reviewDate: { type: Date, required: true },

    }],
    numReview: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.pre("validate", function (next) {
    this.slug = slugify(this.title, {
        lower: true,
        // strict:true
    })

    next()
})
const productModel = mongoose.model<productsProps>("products", productSchema)
export default productModel