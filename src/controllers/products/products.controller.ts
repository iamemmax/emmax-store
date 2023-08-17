import { Request, Response } from "express";
import productModel, { productReviewProps, productsProps } from "../../model/products/products.model";
import { HydratedDocument } from "mongoose";
import AsyncHandler from 'express-async-handler';


// @DESC:create products
//@METHOD:post
//@ROUTES:localhost:3001/api/products/craete
export const createProduct = async (req: Request<{}, {}, productsProps>, res: Response) => {
    const { brand, title, category, description, price, productImgs, quantity, userId, size, colors } = req.body
    try {
        const productExit = await productModel.findOne<productsProps>({ title })
        if (productExit) {
            return res.status(401).json({ msg: `product already exist` })
        }
        const product: HydratedDocument<productsProps> = await new productModel({
            title, category, description, price, size, colors, productImgs, brand, quantity, userId
        }).save()
        if (product) {
            return res.status(201).json({
                res: "ok",
                msg: "product created successfully",
                product
            })
        } else {
            return res.status(401).json({
                res: "fail",
                msg: "unable to created product",
            })
        }
    } catch (error: any) {
        res.status(501).json({
            res: "fail",
            msg: error.message
        })
    }
}

// @DESC:list all products
//@METHOD:get
//@ROUTES:localhost:3001/api/products
export const getProductList = AsyncHandler(async (req: Request, res: Response) => {
    try {
        const products = await productModel.find<productsProps>().populate("userId category", " -password -__v -token -updatedAt -createdAt").select("-__v").sort({ "createdAt": -1 })
        res.status(201).json({
            res: "ok",
            total: products?.length,
            products
        })

    } catch (error: any) {
        res.status(405).json({ msg: error.message })

    }
})

// @DESC:get single product
//@METHOD:GET
//@ROUTES:localhost:3001/api/products/:slug
export const getSingleProduct = AsyncHandler(async (req: Request<{ slug: string }, {}, productsProps>, res: Response) => {
    try {
        let { slug } = req.params
        if (!slug) {
            res.status(400)
            throw new Error("product slug is required")
        }
        const product = await productModel.findOne({ slug }).populate("userId category", "-password -__v -token",).select("-__v -password").populate({ path: "productReviews.userId", select: "-password -token -verified -roles -__v" })

        if (!product) {
            res.status(400)
            throw new Error("no product found")
        }
        res.status(201).json({
            res: "ok",
            product
        })
    } catch (error: any) {
        res.status(400)
        throw new Error(error.message)
    }
})

// @DESC:list all related products
//@METHOD:get
//@ROUTES:localhost:3001/api/products/:slug

export const getRelatedProduct = AsyncHandler(async (req: Request<productsProps>, res: Response) => {
    const { slug, category } = req.params
    try {
        const products = await productModel.find<productsProps>({
            category: { $eq: category },
            slug: { $ne: slug }
        }).populate("userId category", "-_id -password -__v -token -updatedAt -createdAt").select("-__v")
        res.status(201).json({
            res: "ok",
            total: products?.length,
            products
        })

    } catch (error: any) {
        res.status(405).json({ msg: error.message })

    }
})

// @DESC:list all  products by category
//@METHOD:get
//@ROUTES:localhost:3001/api/products/category

export const getProductByCategory = AsyncHandler(async (req: Request<productsProps>, res: Response) => {
    const { category } = req.params
    try {
        const products = await productModel.find<productsProps>({
            category,
        }).populate("userId category", "-_id -password -__v -token -updatedAt -createdAt").select("-__v").sort("asc")

        res.status(201).json({
            res: "ok",
            total: products?.length,
            products
        })

    } catch (error: any) {
        res.status(405).json({ msg: error.message })

    }
})

// @DESC: top selling products
//@METHOD:get
//@ROUTES:localhost:3001/api/products/topselling

export const getTopSellingProduct = AsyncHandler(async (req: Request<productsProps>, res: Response) => {
    try {
        const products = await productModel.find<productsProps>({
            sold: { $gt: 0 },
        }).populate("userId category", "-_id -password -__v -token -updatedAt -createdAt").select("-__v").sort("asc")
        if (!products) {
            res.status(401).json({ res: "fail", msg: "products not found" })
        }
        res.status(201).json({
            res: "ok",
            total: products?.length,
            products
        })

    } catch (error: any) {
        res.status(501).json({ msg: error.message })

    }
})

// @DESC: delete product
//@METHOD:delete
//@ROUTES:localhost:3001/api/products/:productId

export const deleteProduct = AsyncHandler(async (req: Request<productsProps>, res: Response) => {
    const { productId } = req.params

    try {
        const product = await productModel.findOneAndDelete<productsProps>({ productId })
        if (!product) {
            res.status(401).json({ res: "fail", msg: "product not found" })
        }
        res.status(201).json({
            res: "ok",
            msg: "product deleted successfully"
        })
    } catch (error: any) {
        res.status(501).json({ msg: error.message })

    }
})


// @DESC: update product
//@METHOD:PUT
//@ROUTES:localhost:3001/api/products/update/:productId
export const updateProduct = AsyncHandler(async (req: Request<{ productId: string }, {}, productsProps>, res: Response) => {
    let { productId } = req.params
    const { category, title, brand, description, price, productImgs, quantity, size, colors, userId, sold } = req.body
    try {
        const product = await productModel.findOne<productsProps>({ productId })
        if (!product) {
            res.status(401).json({
                res: "fail",
                msg: "user not found"
            })
        }
        const updateProduct = await productModel.findOneAndUpdate({ productId }, {
            $set: {
                title: title || product?.title,
                productImgs: productImgs || product?.productImgs,
                category: category || product?.category,
                userId: userId || product?.userId,
                size: size || product?.size,
                colors: colors || product?.colors,
                brand: brand || product?.brand,
                description: description || product?.description,
                price: price || product?.price,
                quantity: quantity || product?.quantity,
                sold: sold || product?.sold,
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


// @DESC: review product
//@METHOD:PUT
//@ROUTES:localhost:3001/api/products/update/:productId

export const reviewProduct = (AsyncHandler(async (req: Request<{ productId: string }, {}, productReviewProps>, res: Response) => {
    let { productId } = req.params


    const { userId, comment, review } = req.body
    const reviewItem = { userId, comment, review, reviewDate: new Date(Date.now()) }
    try {
        const products = await productModel.findOne({ productId })
        if (products) {
            const alreadyReviewed = products.productReviews.find((product: productReviewProps) => product.userId.toString() === userId.toString())
            if (alreadyReviewed) {
                res.status(401)
                throw new Error("Product already reviewed")
            }
            const data = await products.productReviews.reduce((acc, item) => item.review + acc, 0)
            const length = products?.productReviews?.length + 1
            const result = data / length

            products.productReviews.push(reviewItem)
            products.numReview = products?.productReviews?.length
            products.rating = result
            const savedProduct = await products.save()
            //      
            if (savedProduct) {
                // const update = await productModel.findOneAndUpdate({ productId }, { $set: { rating: products.productReviews.reduce((acc, item) => item.review + acc, 0) / savedProduct.productReviews.length } }, { new: true })
                res.status(200).json({
                    res: "ok",
                    msg: "product review successfully",
                    products: savedProduct,
                    reviewproduct: savedProduct?.productReviews
                })
            } else {
                res.status(401)
                throw new Error("unable to review product")
            }
        }

    } catch (error: any) {
        res.status(401)
        throw new Error(error.message)
    }
}))