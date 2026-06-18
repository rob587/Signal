import React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditSignalModal = ({ isOpen, onClose, signal, onSave }) => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);
  return <div></div>;
};

export default EditSignalModal;
