import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema, ErrorValidationOptions } from "joi";


export const validateSchema = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { value, error } = await schema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(404).json({
                res: "fail",
                msg: error.details?.map((x) => x.message).join(","),
            });
        }
        if (value) { return next() }
    } catch (error: any) {
        console.log(error.message);
    }
}



