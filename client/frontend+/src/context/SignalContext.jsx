import { createContext, useState, useEffect } from "react";
import {
  getSignals,
  getConnections,
  findConnections,
  createSignal,
  deleteSignal,
  editSignal,
} from "../services/api";

export const SignalContext = createContext();

export const SignalProvider = ({ children }) => {
  const [signals, setSignals] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // carica i segnali
  const loadSignals = async () => {
    setLoading(true);
    try {
      console.log("📡 Caricando signals dal server...");
      const response = await getSignals();
      console.log("✅ Signals caricati:", response.data.signals);
      setSignals(response.data.signals); // ✅ CORRETTO!
      setError(null);
    } catch (err) {
      console.error("❌ Errore caricamento signals:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await getConnections();
      setConnections(response.data.connections);
    } catch (err) {
      console.error("Error loading connections:", err);
    }
  };

  const addSignal = async (signalData) => {
    setLoading(true);
    try {
      const response = await createSignal(signalData);
      setSignals([...signals, response.data.signal]);

      // trova connections per il nuovo signal
      await findConnections(response.data.signal.id);
      await loadConnections();

      setError(null);
      return response.data.signal;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSignalHandler = async (id) => {
    setLoading(true);
    try {
      await deleteSignal(id); // ← USA deleteSignal DIRETTAMENTE

      setSignals((prev) => prev.filter((s) => s.id !== id));
      await loadConnections();

      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editSignalHandler = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await editSignal(id, updatedData);

      // ✅ VERIFICA CHE response ESISTA E ABBIA I DATI
      if (!response || !response.id) {
        console.error("❌ Risposta non valida:", response);
        throw new Error("Risposta dal server non valida");
      }

      // ✅ AGGIORNA LO STATO CON I NUOVI DATI
      setSignals((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...response } : s)),
      );

      // Ricarica le connessioni
      await findConnections(id);
      await loadConnections();

      setError(null);
      return response;
    } catch (err) {
      console.error("❌ Errore modifica:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignals();
    loadConnections();
  }, []);

  return (
    <SignalContext.Provider
      value={{
        signals,
        connections,
        loading,
        error,
        loadSignals,
        loadConnections,
        addSignal,
        deleteSignal: deleteSignalHandler,
        editSignal: editSignalHandler,
      }}
    >
      {children}
    </SignalContext.Provider>
  );
};
