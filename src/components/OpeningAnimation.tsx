import React, { useState, useEffect } from "react";

const OpeningAnimation: React.FC = () => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Khởi động animation theo phases
    const timeouts = [
      setTimeout(() => setAnimationPhase(1), 200), // Logo CASIO
      setTimeout(() => setAnimationPhase(2), 800), // Logo fx-570ES PLUS
      setTimeout(() => setAnimationPhase(3), 1200), // Màn hình
      setTimeout(() => setAnimationPhase(4), 1600), // Header với mèo
      setTimeout(() => setAnimationPhase(5), 2000), // Keypad
      setTimeout(() => setAnimationPhase(6), 2400),
    ];

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center z-50 overflow-hidden">
      {/* Background particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse ${
              animationPhase >= 1 ? "opacity-30" : "opacity-0"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Calculator Assembly Container */}
      <div className="relative w-full max-w-sm mx-auto">
        {/* CASIO Logo */}
        <div
          className={`absolute top-0 left-0 w-full h-12 flex items-center justify-start pl-4 transition-all duration-800 ease-out ${
            animationPhase >= 1
              ? "transform translate-y-0 opacity-100 scale-100"
              : "transform -translate-y-20 -translate-x-20 opacity-0 scale-150"
          }`}
        >
          <div className="text-white font-bold text-lg tracking-wider">
            CASIO
          </div>
        </div>

        {/* fx-570ES PLUS Logo */}
        <div
          className={`absolute top-0 right-0 w-full h-12 flex items-center justify-end pr-4 transition-all duration-800 ease-out ${
            animationPhase >= 2
              ? "transform translate-y-0 opacity-100 scale-100"
              : "transform -translate-y-20 translate-x-20 opacity-0 scale-75"
          }`}
        >
          <div className="text-gray-300 text-sm italic">fx-570ES PLUS</div>
        </div>

        {/* Main Calculator Frame */}
        <div
          className={`relative bg-slate-700 rounded-3xl shadow-2xl border-4 border-slate-800 transition-all duration-1000 ease-out ${
            animationPhase >= 3
              ? "transform translate-y-0 opacity-100 scale-100"
              : "transform translate-y-full opacity-0 scale-90"
          }`}
        >
          {/* Header with Cat Animation */}
          <div
            className={`bg-slate-800 p-3 text-center rounded-t-3xl transition-all duration-800 ease-out ${
              animationPhase >= 4
                ? "transform translate-x-0 opacity-100"
                : "transform -translate-x-full opacity-0"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-white font-bold text-base opacity-0">
                CASIO
              </div>
              <div className="text-sm text-gray-300 italic opacity-0">
                fx-570ES PLUS
              </div>
            </div>

            {/* Pixel cat animation area */}
            <div className="relative bg-black rounded px-4 py-3 inline-block mb-3 overflow-hidden w-full max-w-xs mx-auto">
              <div className="h-8 relative">
                {/* Cute animated loading cat */}
                <div className="absolute bottom-0 text-green-400 text-lg font-mono animate-bounce">
                  🐱 Loading...
                </div>
              </div>
            </div>
          </div>

          {/* Display Area */}
          <div
            className={`bg-green-100 mx-4 mb-4 rounded-lg p-4 min-h-[80px] border-2 border-green-300 transition-all duration-800 ease-out ${
              animationPhase >= 4
                ? "transform translate-y-0 opacity-100 scale-100"
                : "transform -translate-y-10 opacity-0 scale-95"
            }`}
          >
            <div className="text-right text-green-900">
              <div className="text-sm opacity-60">Initializing...</div>
              <div className="text-2xl font-mono">
                {animationPhase >= 5 ? "CASIO" : "..."}
              </div>
            </div>
          </div>

          {/* Keypad Area */}
          <div
            className={`p-4 pb-6 transition-all duration-1000 ease-out ${
              animationPhase >= 5
                ? "transform translate-y-0 opacity-100"
                : "transform translate-y-10 opacity-0"
            }`}
          >
            {/* Row 1 - Function Keys */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {["SHIFT", "ALPHA", "MODE", "ON"].map((btn, i) => (
                <div
                  key={btn}
                  className={`h-9 bg-blue-600 text-white text-xs rounded flex items-center justify-center font-semibold transition-all duration-300 ease-out ${
                    animationPhase >= 5
                      ? "transform scale-100 opacity-100"
                      : "transform scale-0 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {btn}
                </div>
              ))}
            </div>

            {/* Row 2-6 - Scientific Functions and Numbers */}
            {[
              ["CALC", "∫", "d/dx", "x⁻¹"],
              ["7", "8", "9", "DEL"],
              ["4", "5", "6", "×"],
              ["1", "2", "3", "+"],
              ["0", ".", "EXP", "="],
            ].map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-2 mb-2">
                {row.map((btn, i) => (
                  <div
                    key={btn}
                    className={`h-9 rounded flex items-center justify-center text-sm font-semibold transition-all duration-300 ease-out ${
                      btn === "="
                        ? "bg-orange-500 text-white"
                        : btn === "DEL"
                        ? "bg-red-500 text-white"
                        : ["×", "+"].includes(btn)
                        ? "bg-gray-600 text-white"
                        : isNaN(Number(btn)) && btn !== "."
                        ? "bg-gray-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    } ${
                      animationPhase >= 5
                        ? "transform scale-100 opacity-100"
                        : "transform scale-0 opacity-0"
                    }`}
                    style={{
                      transitionDelay: `${(rowIndex * 4 + i) * 50 + 200}ms`,
                    }}
                  >
                    {btn}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Final Assembly Glow Effect */}
        <div
          className={`absolute inset-0 rounded-3xl transition-all duration-1000 ease-out ${
            animationPhase >= 6
              ? "shadow-2xl shadow-blue-500/20 scale-100"
              : "shadow-none scale-100"
          }`}
        />

        {/* Assembly Complete Text */}
        <div
          className={`absolute -bottom-16 left-0 right-0 text-center transition-all duration-800 ease-out ${
            animationPhase >= 6
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-4 opacity-0"
          }`}
        >
          <div className="text-green-400 text-sm font-mono animate-pulse">
            Assembly Complete
          </div>
          <div className="text-gray-400 text-xs mt-1">Ready to calculate</div>
        </div>
      </div>

      {/* Assembly Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6].map((phase) => (
            <div
              key={phase}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                animationPhase >= phase
                  ? "bg-green-400 scale-125"
                  : "bg-gray-600 scale-100"
              }`}
            />
          ))}
        </div>
        <div className="text-center text-gray-400 text-xs mt-2">
          {animationPhase === 0 && "Initializing..."}
          {animationPhase === 1 && "Loading brand..."}
          {animationPhase === 2 && "Loading model..."}
          {animationPhase === 3 && "Assembling frame..."}
          {animationPhase === 4 && "Installing display..."}
          {animationPhase === 5 && "Mounting keypad..."}
          {animationPhase >= 6 && "Complete!"}
        </div>
      </div>
    </div>
  );
};

export default OpeningAnimation;
