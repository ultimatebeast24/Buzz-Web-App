import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

     // Fetch all users except the logged-in user
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
     
    // Find conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: loggedInUserId,
    })
      .populate("participants", "-password") // Exclude passwords
      .sort({ updatedAt: -1 });

     // Map conversations for quick lookup
    const conversationMap = conversations.reduce((acc, conversation) => {
      const otherParticipant = conversation.participants.find(
        (p) => p._id.toString() !== loggedInUserId
      );
      acc[otherParticipant._id] = {
        participant: otherParticipant,
        lastMessage: conversation.lastMessage,
      };
      return acc;
    }, {});
     
    // Merge all users and prioritize those with conversations
    const sidebarData = allUsers.map((user) => ({
      user,
      conversation: conversationMap[user._id] || null, // Attach conversation if exists
    }));

    res.status(200).json(sidebarData);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

     // Find or create a conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
     
     if (!conversation) {
      conversation = new Conversation({ participants: [senderId, receiverId] });
      await conversation.save();
    }
     
     const newMessage = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

     // Update lastMessage in conversation
     conversation.lastMessage = {
        text,
        image: imageUrl,
        timestamp: Date.now()
     };
   //   await newMessage.save();
   //   await conversation.save();
     
     await Promise.all([conversation.save(), newMessage.save()]); //await newMessage.save();, await conversation.save(); SIMULTANEOUS
   //  const receiverSocketId = getReceiverSocketId(receiverId);
   //  if (receiverSocketId) {
   //    io.to(receiverSocketId).emit("newMessage", newMessage);
   //  }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

     // Find the conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [myId, userToChatId] },
    });
     
     if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({ conversationId: conversation._id });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};