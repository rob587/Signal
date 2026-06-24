// client/src/components/EditSignalModal.jsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditSignalModal = ({ isOpen, onClose, signal, onSave }) => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signal && signal.id) {
      setContent(signal.content || "");
      setMood(signal.mood || "neutral");
    } else {
      // Se signal è undefined, resetta i campi
      setContent("");
      setMood("neutral");
    }
  }, [signal]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content || content.trim() === "") {
      alert("Il contenuto non può essere vuoto");
      return;
    }

    if (!signal || !signal.id) {
      alert("Errore: segnale non valido");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        content: content.trim(),
        mood: mood,
      });
    } catch (error) {
      console.error("❌ Errore salvataggio:", error);
      alert("Errore durante il salvataggio: " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Modifica Segnale
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenuto
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cosa stai pensando?"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mood
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="curious">🤔 Curioso</option>
              <option value="confused">😕 Confuso</option>
              <option value="frustrated">😤 Frustrato</option>
              <option value="neutral">😐 Neutrale</option>
              <option value="happy">😊 Felice</option>
              <option value="excited">🤩 Entusiasta</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Salvataggio..." : " Salva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSignalModal;
