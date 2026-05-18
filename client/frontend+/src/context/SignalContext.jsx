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
};
