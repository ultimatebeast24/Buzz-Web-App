import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectToMongoDB from './db/connectToMongoDB.js';
//variables
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
//adding another middle layer
app.use(express.json()); //to parse the incoming request from the json payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes); //middle layer    
app.use("/api/messages", messageRoutes); //middle layer    

// app.get('/', (req, res) => {
    // root node https://localhost:5000
//     res.send('Hello World!!!!');
// });

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});