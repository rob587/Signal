// client/src/components/GraphViewer.jsx (o pages/Dashboard.jsx)

import React, { useContext, useEffect, useState } from "react";
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

  // Converti signals in nodi React Flow
  useEffect(() => {
    if (!signals || signals.length === 0) {
      setNodes([]);
      return;
    }

    const newNodes = signals
      .map((signal, index) => {
        if (!signal || !signal.id) {
          console.warn("Segnale invalido:", signal);
          return null;
        }

        return {
          id: signal.id.toString(),
          type: "custom",
          data: {
            content: signal.content || "Segnale vuoto",
            mood: signal.mood || "neutral",
            onEdit: (nodeId) => {
              if (!nodeId) {
                console.error(" ID nodo non valido");
                return;
              }

              const signalId = parseInt(nodeId);
              if (isNaN(signalId)) {
                console.error("❌ ID non è un numero:", nodeId);
                return;
              }

              const signalToEdit = signals.find((s) => s.id === signalId);
              if (signalToEdit) {
                console.log(" Apertura modale per:", signalToEdit);
                setEditingSignal(signalToEdit);
                setIsModalOpen(true);
              } else {
                console.error(" Segnale non trovato per ID:", signalId);

                loadSignals();
                alert("Segnale non trovato. Ricarico i dati...");
              }
            },
          },
          position: {
            x: Math.cos((index / signals.length) * Math.PI * 2) * 300 + 400,
            y: Math.sin((index / signals.length) * Math.PI * 2) * 300 + 300,
          },
          style: {
            background: getMoodColor(signal.mood),
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            border: "2px solid #6366f1",
            minWidth: "120px",
            cursor: "pointer",
          },
        };
      })
      .filter(Boolean);

    setNodes(newNodes);
  }, [signals, setNodes]);

  // Converti connections in edges
  useEffect(() => {
    if (!connections || connections.length === 0) {
      setEdges([]);
      return;
    }

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

  // Funzioni helper per colori
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
    if (!editingSignal || !editingSignal.id) {
      console.error("❌ Nessun segnale da modificare");
      return;
    }

    try {
      await editSignal(editingSignal.id, updatedData);
      setIsModalOpen(false);
      setEditingSignal(null);
    } catch (error) {
      console.error(" Errore salvataggio:", error);
      alert("Errore durante il salvataggio: " + (error.message || ""));
    }
  };

  // Gestisci chiusura modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSignal(null);
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

      <EditSignalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        signal={editingSignal}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default GraphViewer;
