import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getSmartReplies = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid messages provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the last few messages in this conversation, generate three concise smart replies.
    The user you are replying to is the last person who sent a message.
    The replies should be short, and in the same tone as the conversation.
    Do not include any other text, just the replies.
    The replies should be in a JSON array format.

    Conversation:
    ${messages.map((m) => `${m.senderId}: ${m.message}`).join("\n")}

    Smart Replies:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const replies = JSON.parse(text);
    res.status(200).json({ replies });
  } catch (error) {
    console.error("Error in getSmartReplies: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const detectToxicity = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Invalid text provided" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Analyze the following text for toxicity. Return "true" if the text is toxic, and "false" otherwise.

        Text:
        ${text}

        Is Toxic:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const isToxic = response.text().toLowerCase() === 'true';

        res.status(200).json({ isToxic });
    } catch (error) {
        console.error("Error in detectToxicity: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAutoSuggestions = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Invalid text provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the following text, generate a few auto-suggestions to complete the sentence.
    The suggestions should be short and relevant to the text.
    Do not include any other text, just the suggestions.
    The suggestions should be in a JSON array format.

    Text:
    ${text}

    Suggestions:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = JSON.parse(response.text());

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error in getAutoSuggestions: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const analyzeSentiment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Invalid text provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the sentiment of the following text and return "Positive", "Negative", or "Neutral".

    Text:
    ${text}

    Sentiment:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sentiment = response.text();

    res.status(200).json({ sentiment });
  } catch (error) {
    console.error("Error in analyzeSentiment: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
