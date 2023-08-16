import Joi from 'joi';
import { CategoryProps } from '../../model/category.model';
import { productSliderProps } from '../../model/products/slider.model';
import { Schema } from 'mongoose';
import { productReviewProps, productsProps } from '../../model/products/products.model';

export const validateCategory = Joi.object<Pick<CategoryProps, "name">>({
    name: Joi.string().required(),

})
export const validateProductSlider = Joi.object<productSliderProps>({
    title: Joi.string().required(),
    category: Joi.required(),
    postedBy: Joi.required(),
    img: Joi.string().required()

})
export const validateProduct = Joi.object<productsProps>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string(),
    category: Joi.required(),
    userId: Joi.required(),
    productImgs: Joi.required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    size: Joi.array<string>().required(),
    colors: Joi.array<string>().required()

})

export const validateReviewProduct = Joi.object<productReviewProps>({
    comment: Joi.string().required(),
    review: Joi.number().required(),
    userId: Joi.required(),
    reviewDate: Joi.date()

})