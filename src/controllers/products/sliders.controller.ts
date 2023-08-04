import { Request, Response } from 'express';
import AsyncHandler from 'express-async-handler';
import sliderModel, { productSliderProps } from '../../model/products/slider.model';


export const createSlider = async (req: Request<{}, {}, productSliderProps>, res: Response) => {
    const { title, category, img, postedBy } = req.body
    try {
        const sliderExist = await sliderModel.findOne<productSliderProps>({ title })
        if (sliderExist) {
            return res.json({ msg: `${title} already exist` })
        }
        const createSlider = await new sliderModel({
            title, category, img, postedBy
        }).save()
        if (createSlider) {
            res.status(201).json({
                res: "ok",
                msg: "product slider created successfully",
                createSlider
            })
        }
        else {
            res.send("unable to create category");
        }
    } catch (error: any) {
        res.status(403);
        throw new Error(error.message);
    }
}



// @DESC:list all categorys
//@METHOD:get
//@ROUTES:localhost:3001/api/categories

export const getSliderList = AsyncHandler(async (req: Request, res: Response) => {
    try {
        const products = await sliderModel.find<productSliderProps>().populate("postedBy category", "-_id -password -__v -token").select("-__v")
        res.status(201).json({
            res: "ok",
            total: products?.length,
            products
        })

    } catch (error: any) {
        res.status(405).json({ msg: error.message })

    }
})


// @DESC:get single category
//@METHOD:GET
//@ROUTES:localhost:3001/api/products/slider/:productId


export const getSingleSlider = AsyncHandler(async (req: Request<{ productId: string }, {}, productSliderProps>, res: Response) => {
    try {
        let { productId } = req.params
        if (!productId) {
            throw new Error("productId is required")
        }
        const product = await sliderModel.findOne({ productId }).populate("postedBy category", "-_id -password -__v -token").select("-__v")
        if (!product) {
            res.status(403).json({
                res: "fail",
                status: "no product found",
            })
        }
        res.status(201).json({
            res: "ok",
            product
        })
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})



// @DESC: update product slider
//@METHOD:Put
//@ROUTES:localhost:3001/api/category/:userId
export const updateCategory = AsyncHandler(async (req: Request<{ productId: string }, {}, productSliderProps>, res: Response) => {
    let { productId } = req.params
    const { category, img, title, postedBy } = req.body
    try {
        const product = await sliderModel.findOne<productSliderProps>({ productId })
        if (!product) {
            res.status(401).json({
                res: "fail",
                msg: "user not found"
            })
        }
        const updateProduct = await sliderModel.findOneAndUpdate({ productId }, {
            $set: {
                title: title || product?.title,
                img: img || product?.img,
                category: category || product?.category,
                postedBy: postedBy || product?.postedBy,
            },
        }, { new: true })
        if (!updateProduct) {
            res.status(401).json({
                res: "fail",
                msg: "unable to update product"
            })
        } else {
            res.status(201).json({
                res: "ok",
                msg: "product updated successfully",
                product: updateProduct
            })
        }
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})



// @DESC:delete a particular slider 
//@METHOD:delete
//@ROUTES:localhost:3001/api/product/slider/delete/:userid
//@ROLES:admin
export const deleteProductSlide = AsyncHandler(async (req: Request<productSliderProps>, res: Response) => {
    let { productId } = req.params
    try {
        const product = await sliderModel.findOneAndDelete<productSliderProps>({ productId })
        res.status(201).json({
            res: "ok",
            msg: "product deleted successfully",
            product
        })
    } catch (error: any) {
        res.status(405).json({ msg: error.message })
    }
})