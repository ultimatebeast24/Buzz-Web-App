import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

import connectToMongoDB from './db/connectToMongoDB.js';
import { app,server } from './utils/socket.js';
//variables

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

dotenv.config();

const PORT = process.env.PORT || 5001;


//adding another middle layer
app.use(express.json()); //to get the user creds from the db //to parse the incoming request from the json payloads (from req.body)
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes); //middle layer    
app.use("/api/messages", messageRoutes); //middle layer

// app.get('/', (req, res) => {
    // root node https://localhost:5000
//     res.send('Hello World!!!!');
// });

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});