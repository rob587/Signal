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
  const response = await fetch(`http://localhost:5000/api/signals/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Errore nell'eliminazione del segnale");
  }
  return response.json();
};

export const editSignal = async (id, data) => {
  try {
    const response = await fetch(`http://localhost:5000/api/signals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Errore nella modifica del segnale");
    }

    const result = await response.json();
    console.log("✅ Risposta edit:", result); // ← LOG PER DEBUG
    return result; // ← RESTITUISCE IL SEGNALE AGGIORNATO
  } catch (error) {
    console.error("❌ Errore editSignal:", error);
    throw error;
  }
};

export default API;
