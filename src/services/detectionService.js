import api from "./api";

export const sendDetection = async (hand, confidence) => {
    const response = await api.post("/detections/", {
        hand: hand.toUpperCase(),
        confidence,
    });

    return response.data;
};