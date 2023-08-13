import express, { Request, Response } from "express"
import 'dotenv/config'
import Logger from "morgan"
import cors from "cors"
import "colors"
import userRoutes from "./routes/user.routes"
import categoryRoutes from "./routes/category/category.route";
import productRoutes from "./routes/products/products.route"
import connectDb from "./config/Db.connection"
import { errorHandler, notFound } from "./middlewares/errorHandler"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({ credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(Logger("dev"))
app.use(cookieParser());
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, p Express');
});


// routes
app.use("/api/users", userRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/products", productRoutes)

//custom middlewares
app.use(notFound)
app.use(errorHandler)

// listening to port
const PORT = process.env.PORT
connectDb().then((res: any) => {
    app.listen(PORT, async () => {
        console.log(`server started on localhost:${PORT}`.red)


    })

})