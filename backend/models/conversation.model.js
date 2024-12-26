import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lastMessage: {
      text: { type: String },
      image: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
}, { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;