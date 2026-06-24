import React from "react";
import { useContext } from "react";
import GraphViewer from "../components/GraphViewer";
import SignalForm from "../components/SignalForm";
import { SignalContext } from "../context/SignalContext";

const Dashboard = () => {
  const { signals, connections } = useContext(SignalContext);

  return (
    <>
      <div className="flex h-screen bg-slate-950">
        {/* Sidebar */}
        <div className="w-96 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2"> Signal</h1>
            <p className="text-gray-400">AI Knowledge & Trend System</p>
          </div>

          <SignalForm />

          {/* Stats */}
          <div className="mt-8 space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-gray-400 text-sm">Total Signals</p>
              <p className="text-2xl font-bold text-white">{signals.length}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-gray-400 text-sm">Connections</p>
              <p className="text-2xl font-bold text-white">
                {connections.length}
              </p>
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1">
          <GraphViewer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
