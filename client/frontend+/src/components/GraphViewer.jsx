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

  return <div></div>;
};

export default GraphViewer;
