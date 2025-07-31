import React from "react";
import Calculator from "./components/Calculator";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Calculator />
      </div>
    </div>
  );
}

export default App;
