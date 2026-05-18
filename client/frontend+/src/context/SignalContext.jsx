import { createContext, useState, useEffect } from "react";
import {
  getSignals,
  getConnections,
  findConnections,
  createSignal,
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
      const response = await getSignals();
      getSignals(response.data.signals);
      setError(null);
    } catch (err) {
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
      }}
    >
      {children}
    </SignalContext.Provider>
  );
};
