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

const CustomNode = ({ id, data }) => {
  const { deleteSignal } = useContext(SignalContext);

  const handleEdit = () => {
    if (data.onEdit) {
      data.onEdit(id);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo segnale?")) {
      try {
        await deleteSignal(parseInt(id));
      } catch (error) {
        console.error("Errore:", error);
        alert("Errore durante l'eliminazione");
      }
    }
  };

  return (
    <>
      <div
        className="relative group p-3 rounded-lg shadow-lg border-2 transition-all hover:shadow-xl"
        style={{
          background: getMoodColor(data.mood),
          color: "#fff",
          borderColor: "#6366f1",
          minWidth: "140px",
          cursor: "pointer",
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-gray-400"
        />

        {/* Contenuto del nodo */}
        <div className="text-center">
          <div className="text-sm font-semibold line-clamp-2">
            {data.content || "Segnale"}
          </div>
          <div className="text-xs opacity-80 mt-1 capitalize">
            {data.mood || "neutral"}
          </div>
        </div>

        {/* Pulsanti azioni - visibili al hover */}
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            title="Modifica"
          >
            <Pencil size={14} className="text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition"
            title="Elimina"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-gray-400"
        />
      </div>
    </>
  );
};

export default CustomNode;
