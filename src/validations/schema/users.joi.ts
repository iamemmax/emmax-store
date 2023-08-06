import Joi from 'joi';
import { authenticateUserTypes, createuserTypes } from '../interface/userTypes';

export const createUserValidation = Joi.object<createuserTypes>({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().required().label("First name"),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password2: Joi.ref('password')

})
export const validateLoginSchema = Joi.object<authenticateUserTypes>({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})
export const validateToken = Joi.object<Pick<createuserTypes, "token">>({
    token: Joi.number().required(),

})
export const validateResetPassword = Joi.object<Pick<createuserTypes, "password" | "password2">>({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password2: Joi.ref('password')

})
export const validateForgetPaswword = Joi.object<authenticateUserTypes>({
    email: Joi.string().email().required(),

})