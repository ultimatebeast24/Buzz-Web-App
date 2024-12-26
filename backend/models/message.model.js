import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation"
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
      },
      image: {
			type: String,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;