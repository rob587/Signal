import { SignalProvider } from "./context/SignalContext";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <SignalProvider>
        <Dashboard />
      </SignalProvider>
    </>
  );
}

export default App;
