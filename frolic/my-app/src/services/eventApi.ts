import axios from "axios";
import { API_BASE_URL } from "../constants/url";

// Using the direct base URL or relative based on configs
export const createEvent = async (eventData: FormData) => {
  const res = await axios.post(`${API_BASE_URL}/api/events`, eventData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getEventById = async (eventId: string) => {
  const res = await axios.get(`${API_BASE_URL}/api/events/${eventId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateEvent = async (eventId: string, eventData: FormData) => {
  const res = await axios.put(`${API_BASE_URL}/api/events/${eventId}`, eventData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteEvent = async (eventId: string) => {
  const res = await axios.delete(`${API_BASE_URL}/api/events/${eventId}`, {
    withCredentials: true,
  });
  return res.data;
};
