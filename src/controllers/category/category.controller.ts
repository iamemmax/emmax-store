import { Request, Response } from 'express';
import AsyncHandler from 'express-async-handler';
import categoryModel, { CategoryProps } from '../../model/category.model';
import { HydratedDocument } from 'mongoose';



// @DESC:create a product category
//@METHOD:Post
//@ROUTES:localhost:3001/api/category/create
export const createProductCategory = async (req: Request<{}, {}, CategoryProps>, res: Response) => {
    const { name } = req.body
    try {
        const categoryExist = await categoryModel.findOne<CategoryProps>({ name })
        if (categoryExist) {
            return res.json({ msg: `category ${name} already exist` })
        }
        const category: HydratedDocument<CategoryProps> = await new categoryModel({ name }).save()
        if (category) {
            return res.status(201).json({
                res: "ok",
                status: "success",
                msg: "Category created successfully",
                category
            })
        } else {
            res.status(401).send("unable to create category");
        }
    } catch (error: any) {
        res.status(401);
        throw new Error(error.message);
    }
}


// @DESC:list all categorys
//@METHOD:get
//@ROUTES:localhost:3001/api/categories

export const getCategoryList = AsyncHandler(async (req: Request, res: Response) => {
    try {
        const categories = await categoryModel.find<CategoryProps>().select("-__v ")
        res.status(201).json({
            res: "ok",
            total: categories?.length,
            categories
        })

    } catch (error: any) {
        res.status(405).json({ msg: error.message })

    }
})

// @DESC:get single category
//@METHOD:GET
//@ROUTES:localhost:3001/api/category/:userId


export const getSingleCategory = AsyncHandler(async (req: Request<CategoryProps>, res: Response) => {
    try {
        let { categoryId } = req.params
        if (!categoryId) {
            throw new Error("categoryId is required")
        }
        const category = await categoryModel.findOne({ categoryId })
        if (!category) {
            res.status(403).json({
                res: "fail",
                status: "no category found",
            })
        }
        res.status(201).json({
            res: "ok",
            category
        })
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})

// @DESC: update category
//@METHOD:Put
//@ROUTES:localhost:3001/api/category/:userId
export const updateCategory = AsyncHandler(async (req: Request<CategoryProps, {}, CategoryProps>, res: Response) => {
    let { categoryId } = req.params
    const { name } = req.body
    try {
        const categoryExist = await categoryModel.findOne<CategoryProps>({ categoryId })
        if (!categoryExist) {
            res.status(401).json({
                res: "fail",
                msg: "user not found"
            })
        }
        const category = await categoryModel.findOneAndUpdate({ categoryId }, {
            $set: {
                name: name || categoryExist?.name
            },
        }, { new: true })
        if (!category) {
            res.status(401).json({
                res: "fail",
                msg: "unable to update category"
            })
        } else {
            res.status(201).json({
                res: "ok",
                msg: "category updated successfully",
                category
            })
        }
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})


// @DESC:delete a particular category 
//@METHOD:delete
//@ROUTES:localhost:3001/api/category/delete/:userid
//@ROLES:admin
export const deleteCategory = AsyncHandler(async (req: Request<CategoryProps>, res: Response) => {
    let { categoryId } = req.params
    try {
        const category = await categoryModel.findOneAndDelete<CategoryProps>({ categoryId })
        res.status(201).json({
            res: "ok",
            msg: "category deleted successfully",
            category
        })
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})