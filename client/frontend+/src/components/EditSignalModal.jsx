import React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditSignalModal = ({ isOpen, onClose, signal, onSave }) => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signal) {
      setContent(signal.content || "");
      setMood(signal.mood || "neutral");
    }
  }, [signal]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Il contenuto non può essere vuoto");
      return;
    }
    setLoading(true);
    try {
      await onSave({
        content: content.trim(),
        mood: mood,
      });
      onClose();
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return <div></div>;
};

export default EditSignalModal;
