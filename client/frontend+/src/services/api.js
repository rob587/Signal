import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getSignals = () => {
  return API.get("/signals/all");
};

export const createSignal = (data) => {
  return API.post("/signals/create", data);
};

export const findConnections = (signalId) => {
  return API.post("/connections/find", { signal_id: signalId });
};

export const getConnections = (signalId = null) => {
  const url = signalId
    ? `/connections/all?signal_id=${signalId}`
    : "/connections/all";
  return API.get(url);
};

export const deleteSignal = async (id) => {
  const response = await API.delete(`/signals/${id}`);
  return response.data;
};

export const editSignal = async (id, data) => {
  const response = await API.put(`/signals/${id}`, data);
  console.log("✅ Risposta edit:", response.data);
  return response.data;
};

export default API;
