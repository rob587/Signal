import React from "react";
import React, { useContext } from "react";
import { Handle, Position } from "reactflow";
import { Trash2, Pencil } from "lucide-react";
import { SignalContext } from "../context/SignalContext";

const getMoodColor = (mood) => {
  const colors = {
    frustrated: "#ef4444",
    confused: "#f59e0b",
    curious: "#3b82f6",
    neutral: "#6366f1",
    happy: "#10b981",
    excited: "#8b5cf6",
  };
  return colors[mood] || "#6366f1";
};

const CustomNode = () => {
  return <div></div>;
};

export default CustomNode;
