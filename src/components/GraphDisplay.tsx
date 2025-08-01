import React, { useRef, useEffect, useState } from "react";

interface GraphDisplayProps {
  functionInput: string;
  graphPoints: Array<{ x: number; y: number }>;
  onFunctionInputChange: (value: string) => void;
  onCalculateGraph: () => void;
  onBackToCalculator: () => void;
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({
  functionInput,
  graphPoints,
  onFunctionInputChange,
  onCalculateGraph,
  onBackToCalculator,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize] = useState({ width: 320, height: 240 });

  // Vẽ đồ thị
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Xóa canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Thiết lập màu nền
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Thiết lập tọa độ
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const scaleX = canvasSize.width / 20; // Hiển thị từ -10 đến 10
    const scaleY = canvasSize.height / 20; // Hiển thị từ -10 đến 10

    // Vẽ lưới
    ctx.strokeStyle = "#374151"; // gray-700
    ctx.lineWidth = 0.5;

    // Vẽ lưới dọc
    for (let i = -10; i <= 10; i++) {
      const x = centerX + i * scaleX;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }

    // Vẽ lưới ngang
    for (let i = -10; i <= 10; i++) {
      const y = centerY - i * scaleY;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }

    // Vẽ trục tọa độ chính
    ctx.strokeStyle = "#9ca3af"; // gray-400
    ctx.lineWidth = 1;

    // Trục X
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasSize.width, centerY);
    ctx.stroke();

    // Trục Y
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvasSize.height);
    ctx.stroke();

    // Vẽ các vạch chia và số
    ctx.fillStyle = "#d1d5db"; // gray-300
    ctx.font = "10px monospace";
    ctx.textAlign = "center";

    // Vạch chia trục X
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        const x = centerX + i * scaleX;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 3);
        ctx.lineTo(x, centerY + 3);
        ctx.stroke();
        ctx.fillText(i.toString(), x, centerY + 15);
      }
    }

    // Vạch chia trục Y
    ctx.textAlign = "right";
    for (let i = -10; i <= 10; i += 2) {
      if (i !== 0) {
        const y = centerY - i * scaleY;
        ctx.beginPath();
        ctx.moveTo(centerX - 3, y);
        ctx.lineTo(centerX + 3, y);
        ctx.stroke();
        ctx.fillText(i.toString(), centerX - 8, y + 3);
      }
    }

    // Vẽ đồ thị hàm số
    if (graphPoints.length > 1) {
      ctx.strokeStyle = "#10b981"; // emerald-500
      ctx.lineWidth = 2;
      ctx.beginPath();

      let isFirstPoint = true;

      for (const point of graphPoints) {
        const canvasX = centerX + point.x * scaleX;
        const canvasY = centerY - point.y * scaleY;

        // Chỉ vẽ những điểm trong phạm vi canvas
        if (
          canvasX >= 0 &&
          canvasX <= canvasSize.width &&
          canvasY >= 0 &&
          canvasY <= canvasSize.height
        ) {
          if (isFirstPoint) {
            ctx.moveTo(canvasX, canvasY);
            isFirstPoint = false;
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        }
      }

      ctx.stroke();
    }
  }, [graphPoints, canvasSize]);

  return (
    <div className="bg-green-100 border-2 border-green-200 rounded-lg mx-4 mt-2 mb-4 p-4">
      {/* Header chế độ đồ thị */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-800">GRAPH MODE</h3>
        <button
          onClick={onBackToCalculator}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
        >
          CALC
        </button>
      </div>

      {/* Nhập hàm số */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Function: f(x) =
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={functionInput}
            onChange={(e) => onFunctionInputChange(e.target.value)}
            placeholder="x^2 + 2*x + 1"
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
          />
          <button
            onClick={onCalculateGraph}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded font-bold"
          >
            DRAW
          </button>
        </div>
      </div>

      {/* Canvas vẽ đồ thị */}
      <div className="border-2 border-gray-400 rounded bg-slate-900">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="block"
        />
      </div>

      {/* Thông tin hàm số */}
      {functionInput && (
        <div className="mt-2 text-xs text-gray-600">
          <span className="font-semibold">Current:</span> f(x) = {functionInput}
        </div>
      )}
    </div>
  );
};

export default GraphDisplay;
