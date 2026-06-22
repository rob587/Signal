import React, { useContext, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "reactflow";
import { SignalContext } from "../context/SignalContext";
import CustomNode from "../components/CustomNode";
import EditSignalModal from "../components/EditSignalModal";
import "reactflow/dist/style.css";

// Registra il nodo personalizzato
const nodeTypes = {
  custom: CustomNode,
};

const GraphViewer = () => {
  const { signals, connections, deleteSignal, editSignal } =
    useContext(SignalContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Stato per il modale di edit
  const [editingSignal, setEditingSignal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Converti signals in nodi React Flow con tipo custom
  useEffect(() => {
    const newNodes = signals.map((signal, index) => ({
      id: signal.id.toString(),
      type: "custom",
      data: {
        content: signal.content,
        mood: signal.mood,
        onEdit: (id) => {
          // Apri modale con il segnale da editare
          const signalToEdit = signals.find((s) => s.id === parseInt(id));
          setEditingSignal(signalToEdit);
          setIsModalOpen(true);
        },
      },
      position: {
        x: Math.cos((index / signals.length) * Math.PI * 2) * 300 + 400,
        y: Math.sin((index / signals.length) * Math.PI * 2) * 300 + 300,
      },
    }));
    setNodes(newNodes);
  }, [signals, setNodes]);

  // Converti connections in edges (come prima)
  useEffect(() => {
    const newEdges = connections.map((conn) => ({
      id: `edge-${conn.id}`,
      source: conn.signal_id_1.toString(),
      target: conn.signal_id_2.toString(),
      animated: true,
      style: {
        stroke: getStrengthColor(conn.strength),
        strokeWidth: conn.strength * 3 + 1,
      },
      label: conn.relationship_type || "connesso",
      labelStyle: {
        fontSize: "10px",
        backgroundColor: "#fff",
        padding: "2px 6px",
        borderRadius: "4px",
        color: "#333",
      },
    }));
    setEdges(newEdges);
  }, [connections, setEdges]);

  // Funzioni helper (come prima)
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

  const getStrengthColor = (strength) => {
    if (strength > 0.7) return "#10b981";
    if (strength > 0.4) return "#f59e0b";
    return "#ef4444";
  };

  // Gestisci salvataggio edit
  const handleSaveEdit = async (updatedData) => {
    if (editingSignal) {
      await editSignal(editingSignal.id, updatedData);
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-slate-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#334155" gap={16} />
          <Controls />
          <MiniMap
            style={{
              background: "#0f172a",
              borderRadius: "8px",
            }}
            maskColor="rgba(15, 23, 42, 0.6)"
          />
        </ReactFlow>
      </div>

      {/* Modale di edit */}
      <EditSignalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSignal(null);
        }}
        signal={editingSignal}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default GraphViewer;
