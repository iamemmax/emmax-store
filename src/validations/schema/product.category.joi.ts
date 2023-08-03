import Joi from 'joi';
import { CategoryProps } from '../../model/category.model';

export const validateCategory = Joi.object<Pick<CategoryProps, "name">>({
    name: Joi.string().required(),

})