import axios from "axios";

// Using the direct base URL or relative based on configs
export const createEvent = async (eventData: FormData) => {
  const res = await axios.post("https://frolic-backend-8qmc.onrender.com/api/events", eventData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getEventById = async (eventId: string) => {
  const res = await axios.get(`https://frolic-backend-8qmc.onrender.com/api/events/${eventId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateEvent = async (eventId: string, eventData: FormData) => {
  const res = await axios.put(`https://frolic-backend-8qmc.onrender.com/api/events/${eventId}`, eventData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteEvent = async (eventId: string) => {
  const res = await axios.delete(`https://frolic-backend-8qmc.onrender.com/api/events/${eventId}`, {
    withCredentials: true,
  });
  return res.data;
};
