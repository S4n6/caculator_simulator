import { useState, useEffect } from "react";
import Calculator from "./components/Calculator";
import OpeningAnimation from "./components/OpeningAnimation";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    // Sau 3 giây, bắt đầu fade out animation và hiển thị calculator
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Delay nhỏ để animation fade out mượt mà
      setTimeout(() => {
        setShowCalculator(true);
      }, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Opening Animation */}
      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <OpeningAnimation />
      </div>

      {/* Main Calculator */}
      <div
        className={`transition-all duration-700 ease-out ${
          showCalculator
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4 pointer-events-none"
        } flex items-center justify-center p-1 min-h-screen`}
      >
        <Calculator />
      </div>
    </div>
  );
}

export default App;
