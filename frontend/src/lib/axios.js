import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
});

export const getSmartReplies = async (messages) => {
    const { data } = await axiosInstance.post("/ai/smart-replies", messages);
    return data;
};

export const getAutoSuggestions = async (text) => {
    const { data } = await axiosInstance.post("/ai/auto-suggestions", { text });
    return data;
};

export const analyzeSentiment = async (text) => {
    const { data } = await axiosInstance.post("/ai/sentiment-analysis", { text });
    return data;
}

export const detectToxicity = async (text) => {
    const { data } = await axiosInstance.post("/ai/toxicity-detection", { text });
    return data;
}