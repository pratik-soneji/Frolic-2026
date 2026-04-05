import axios from "axios";

// Using the direct base URL or relative based on configs
export const createEvent = async (eventData: FormData) => {
  const res = await axios.post("http://localhost:5000/api/events", eventData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getEventById = async (eventId: string) => {
  const res = await axios.get(`http://localhost:5000/api/events/${eventId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateEvent = async (eventId: string, eventData: FormData) => {
  const res = await axios.put(`http://localhost:5000/api/events/${eventId}`, eventData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteEvent = async (eventId: string) => {
  const res = await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
    withCredentials: true,
  });
  return res.data;
};
