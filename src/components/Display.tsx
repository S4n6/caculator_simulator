import React from "react";
import GraphArea from "./GraphArea";

interface DisplayProps {
  expression: string;
  result: string;
  isShiftActive?: boolean;
  isAlphaActive?: boolean;
  isCalculatorOn?: boolean;
  currentMode?: "calculator" | "graph";
  graphPoints?: Array<{ x: number; y: number }>;
  functionInput?: string;
}

const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  isShiftActive = false,
  isAlphaActive = false,
  isCalculatorOn = true,
  currentMode = "calculator",
  graphPoints = [],
  functionInput = "",
}) => {
  // When calculator is off, show blank screen
  if (!isCalculatorOn) {
    return (
      <div className="bg-green-100 border-2 border-green-200 rounded-lg mx-2 sm:mx-4 mt-1 mb-1 sm:mb-2 p-2 sm:p-3 relative min-h-[50px] sm:min-h-[60px]">
        <div className="bg-black text-white font-mono p-2 sm:p-3 rounded min-h-[30px] sm:min-h-[40px]">
          {/* Blank display when off */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-100 border-2 border-green-200 rounded-lg mx-2 sm:mx-4 mt-0 mb-0 p-1 sm:p-2 relative min-h-[50px] sm:min-h-[60px]">
      {/* Chỉ báo SHIFT/ALPHA */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2">
        {isShiftActive && (
          <span className="bg-orange-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold">
            SHIFT
          </span>
        )}
        {isAlphaActive && (
          <span className="bg-blue-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold">
            ALPHA
          </span>
        )}
        {currentMode === "graph" && (
          <span className="bg-green-600 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-bold flex items-center gap-1">
            <span>GRAPH</span>
            <span className="text-yellow-300 font-bold">x</span>
          </span>
        )}
      </div>

      {/* Hiển thị theo chế độ */}
      {currentMode === "graph" ? (
        <div className="mt-3 sm:mt-4 lg:mt-5">
          {/* Dòng hiển thị hàm số */}
          <div className="text-left text-xs sm:text-sm text-gray-700 mb-1 sm:mb-1">
            <span className="font-semibold">Graph: y = </span>
            <span className="font-mono">{functionInput || "..."}</span>
          </div>

          {/* Khu vực vẽ đồ thị */}
          <GraphArea graphPoints={graphPoints} functionInput={functionInput} />
        </div>
      ) : (
        <>
          {/* Biểu thức nhỏ ở trên */}
          <div className="text-right text-xs sm:text-sm text-gray-700 min-h-[12px] sm:min-h-[14px] lg:min-h-[18px] mb-1 sm:mb-2">
            {expression && expression !== result ? expression : ""}
          </div>

          {/* Kết quả chính */}
          <div className="text-right text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-gray-800 min-h-[20px] sm:min-h-[28px] lg:min-h-[36px] flex justify-end items-center overflow-hidden">
            <span className="truncate">{result || "0"}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Display;
