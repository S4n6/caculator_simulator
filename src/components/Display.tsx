import React from "react";

interface DisplayProps {
  expression: string;
  result: string;
  isShiftActive?: boolean;
  isAlphaActive?: boolean;
  isCalculatorOn?: boolean;
}

const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  isShiftActive = false,
  isAlphaActive = false,
  isCalculatorOn = true,
}) => {
  // When calculator is off, show blank screen
  if (!isCalculatorOn) {
    return (
      <div className="bg-green-100 border-2 border-green-200 rounded-lg mx-4 mt-2 mb-4 p-4 relative min-h-[90px]">
        <div className="bg-black text-white font-mono p-3 rounded min-h-[60px]">
          {/* Blank display when off */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-100 border-2 border-green-200 rounded-lg mx-4 mt-2 mb-4 p-4 relative min-h-[90px]">
      {/* Chỉ báo SHIFT/ALPHA */}
      <div className="absolute top-2 left-3 flex gap-2">
        {isShiftActive && (
          <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
            SHIFT
          </span>
        )}
        {isAlphaActive && (
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
            ALPHA
          </span>
        )}
      </div>

      {/* Biểu thức nhỏ ở trên */}
      <div className="text-right text-sm text-gray-700 min-h-[18px] mb-2">
        {expression && expression !== result ? expression : ""}
      </div>

      {/* Kết quả chính */}
      <div className="text-right text-3xl font-mono font-bold text-gray-800 min-h-[36px] flex justify-end items-center">
        <span>{result || "0"}</span>
      </div>
    </div>
  );
};

export default Display;
