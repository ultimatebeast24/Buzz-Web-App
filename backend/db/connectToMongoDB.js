import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log(`Connected to MongoDB :${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message)
    }
};

export default connectToMongoDB;