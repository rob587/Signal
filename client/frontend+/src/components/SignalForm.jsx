import React from "react";
import { SignalContext } from "../context/SignalContext";
import { useState, useContext } from "react";

const SignalForm = () => {
  const { addSignal, loading } = useContext(SignalContext);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [signalType, setSignalType] = useState("note");
  const [tags, setTags] = useState("");

  //   gestione del submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSignal({
        user_id: 1,
        content,
        signal_type: signalType,
        mood,
        tags: tags.split(",").map((t) => t.trim()),
      });
      //   reset form
      setContent("");
      setTags("");
      setMood("");
      setSignalType("note");
    } catch (error) {
      console.error("Error creating signal:", error);
    }
  };

  return (
    <>
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4"> Nuovo Signal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Scrivi la tua idea, problema o pensiero..."
            className="w-full p-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500"
            rows="4"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="p-2 bg-slate-900 text-white border border-slate-600 rounded-lg"
            >
              <option value="neutral">😐 Neutral</option>
              <option value="frustrated">😤 Frustrated</option>
              <option value="confused">🤔 Confused</option>
              <option value="curious">🧠 Curious</option>
              <option value="happy">😊 Happy</option>
            </select>

            <select
              value={signalType}
              onChange={(e) => setSignalType(e.target.value)}
              className="p-2 bg-slate-900 text-white border border-slate-600 rounded-lg"
            >
              <option value="note">📝 Note</option>
              <option value="idea">💡 Idea</option>
              <option value="question">❓ Question</option>
              <option value="problem">⚠️ Problem</option>
            </select>
          </div>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tag (separati da virgola)"
            className="w-full p-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crea Signal"}
          </button>
        </form>
      </div>
    </>
  );
};

export default SignalForm;
