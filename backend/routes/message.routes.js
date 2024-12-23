import express from "express"; 
import { getMessages,sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage); //before sending the msg we need to auth if the user is logged in or not

export default router;