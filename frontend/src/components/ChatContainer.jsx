import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';

import ChatHeader from './ChatHeader';
import MessageInput  from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from "../lib/utils";
import { getSmartReplies, analyzeSentiment } from '../lib/axios';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, setMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [smartReplies, setSmartReplies] = useState([]);
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    const fetchSmartReplies = async () => {
      if (messages.length > 0) {
        const lastMessages = messages.slice(-5).map(m => ({ senderId: m.senderId, message: m.text }));
        try {
          const { replies } = await getSmartReplies({ messages: lastMessages });
          setSmartReplies(replies);
        } catch (error) {
          console.error("Failed to fetch smart replies:", error);
        }
      }
    };

    const analyzeConversationSentiment = async () => {
      if (messages.length > 0) {
        const conversationText = messages.map(m => m.text).join(' ');
        try {
          const { sentiment } = await analyzeSentiment(conversationText);
          setSentiment(sentiment);
        } catch (error) {
          console.error("Failed to analyze sentiment:", error);
        }
      }
    };

    fetchSmartReplies();
    analyzeConversationSentiment();
  }, [messages]);

  useEffect(() => { 
    getMessages(selectedUser._id);

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendFromSmartReply = (reply) => {
    // This is a simplified version. You would need to implement the sendMessage logic from MessageInput here.
    // For now, let's just add it to the messages list to see the effect.
    const newMessage = {
      _id: Date.now().toString(),
      senderId: authUser._id,
      text: reply,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} //if we are sender than msg will be displayed on right, using daisy ui buit in classes
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-2 flex justify-center gap-2 items-center">
        {smartReplies.map((reply, index) => (
          <button
            key={index}
            className="btn btn-sm btn-outline"
            onClick={() => handleSendFromSmartReply(reply)}
          >
            {reply}
          </button>
        ))}
        {sentiment && (
          <div className="text-xs opacity-50">
            Conversation Sentiment: {sentiment}
          </div>
        )}
      </div>

      <MessageInput />
      
    </div>
  );
}

export default ChatContainer;