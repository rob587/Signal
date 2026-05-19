import React from "react";
import { useContext, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "reactflow";
import { SignalContext } from "../context/SignalContext";
import "reactflow/dist/style.css";

const GraphViewer = () => {
  const { signals, connections } = useContext(SignalContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // convertitore dei signals in nodi react flow
  useEffect(() => {
    const newNodes = signals.map((signal, index) => ({
      id: signal.id.toString(),
      data: {
        label: (
          <div className="text-center text-sm font-semibold">
            <div>{signal.content.substring(0, 30)}...</div>
            <div className="text-xs text-gray-400 mt-1">{signal.mood}</div>
          </div>
        ),
      },
      position: {
        x: Math.cos((index / signals.length) * Math.PI * 2) * 300,
        y: Math.sin((index / signals.length) * Math.PI * 2) * 300,
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
    }));
    setNodes(newNodes);
  }, [signals, setNodes]);

  // convertitore delle connections in archi
  useEffect(() => {
    const newEdges = connections.map((conn) => ({
      id: `edge-${conn.id}`,
      source: conn.signal_id_1.toString(),
      target: conn.signal_id_2.toString(),
      animated: true,
      style: {
        stroke: getStrengthColor(conn.strength),
        strokeWidth: conn.strength * 3,
      },
      label: `${conn.relationship_type}`,
      labelStyle: {
        fontSize: "12px",
        backgroundColor: "#fff",
        padding: "2px 6px",
        borderRadius: "4px",
      },
    }));
    setEdges(newEdges);
  }, [connections, setEdges]);

  const getMoodColor = (mood) => {
    const colors = {
      frustrated: "#ef4444",
      confused: "#f59e0b",
      curious: "#3b82f6",
      neutral: "#6366f1",
      happy: "#10b981",
    };
    return colors[mood] || "#6366f1";
  };

  const getStrengthColor = (strength) => {
    if (strength > 0.7) return "#10b981";
    if (strength > 0.5) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <>
      <div className="w-full h-screen bg-slate-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Background color="#334155" />
          <Controls />
          <MiniMap style={{ background: "#0f172a" }} />
        </ReactFlow>
      </div>
    </>
  );
};

export default GraphViewer;
