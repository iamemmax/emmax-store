import mongoose from 'mongoose'
import "dotenv/config"

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(String(process.env.DB_URL))
        if (connect) {
            console.log(`database connected successfully`.blue);
        }
    } catch (error: any) {
        console.log("database error");
        process.exit(1)
    }
}

export default connectDb