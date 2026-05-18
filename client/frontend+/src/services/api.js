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

export default API;
