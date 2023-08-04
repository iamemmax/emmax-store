import Joi from 'joi';
import { CategoryProps } from '../../model/category.model';
import { productSliderProps } from '../../model/products/slider.model';
import { Schema } from 'mongoose';

export const validateCategory = Joi.object<Pick<CategoryProps, "name">>({
    name: Joi.string().required(),

})
export const validateProductSlider = Joi.object<productSliderProps>({
    title: Joi.string().required(),
    category: Joi.required(),
    postedBy: Joi.required(),
    img: Joi.string().required()

})


