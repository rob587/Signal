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

  return <div></div>;
};

export default SignalForm;
