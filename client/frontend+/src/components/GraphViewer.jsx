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
  return <div></div>;
};

export default GraphViewer;
