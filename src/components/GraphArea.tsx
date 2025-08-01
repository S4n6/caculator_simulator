import React, { useRef, useEffect } from "react";

interface GraphAreaProps {
  graphPoints: Array<{ x: number; y: number }>;
  functionInput?: string;
}

const GraphArea: React.FC<GraphAreaProps> = ({ graphPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Responsive canvas size
  const getCanvasSize = () => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        // Mobile: very compact canvas
        return { width: 160, height: 70 };
      } else if (screenWidth < 1024) {
        // Tablet
        return { width: 260, height: 130 };
      } else {
        // Desktop: larger canvas
        return { width: 300, height: 130 };
      }
    }
    return { width: 300, height: 130 };
  };

  const [canvasSize, setCanvasSize] = React.useState(getCanvasSize());

  React.useEffect(() => {
    const handleResize = () => {
      setCanvasSize(getCanvasSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("📈 GraphArea rendered with", graphPoints.length, "points");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Xóa canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Thiết lập nền đen như màn hình Casio
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Thiết lập tọa độ với viewport rộng hơn để thấy cả trục X
    const viewportX = { min: -5, max: 5 };
    const viewportY = { min: -5, max: 5 };

    const scaleX = canvasSize.width / (viewportX.max - viewportX.min);
    const scaleY = canvasSize.height / (viewportY.max - viewportY.min);

    // Offset để căn giữa viewport
    const offsetX = -viewportX.min * scaleX;
    const offsetY = viewportY.max * scaleY;

    // Vẽ lưới nhỏ
    ctx.strokeStyle = "#333333"; // Lưới mờ
    ctx.lineWidth = 0.3;

    // Vẽ lưới dọc (mỗi 1 đơn vị)
    for (
      let i = Math.ceil(viewportX.min);
      i <= Math.floor(viewportX.max);
      i++
    ) {
      const x = offsetX + i * scaleX;
      if (x >= 0 && x <= canvasSize.width) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.height);
        ctx.stroke();
      }
    }

    // Vẽ lưới ngang (mỗi 1 đơn vị)
    for (
      let i = Math.ceil(viewportY.min);
      i <= Math.floor(viewportY.max);
      i++
    ) {
      const y = offsetY - i * scaleY;
      if (y >= 0 && y <= canvasSize.height) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      }
    }

    // Vẽ trục tọa độ chính
    ctx.strokeStyle = "#666666"; // Trục sáng hơn
    ctx.lineWidth = 1;

    // Trục X (y = 0)
    const axisY = offsetY - 0 * scaleY;
    if (axisY >= 0 && axisY <= canvasSize.height) {
      ctx.beginPath();
      ctx.moveTo(0, axisY);
      ctx.lineTo(canvasSize.width, axisY);
      ctx.stroke();
    }

    // Trục Y (x = 0)
    const axisX = offsetX + 0 * scaleX;
    if (axisX >= 0 && axisX <= canvasSize.width) {
      ctx.beginPath();
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, canvasSize.height);
      ctx.stroke();
    }

    // Vẽ các vạch chia chính
    ctx.strokeStyle = "#888888";
    ctx.lineWidth = 1;

    // Vạch chia trục X
    const axisYPos = offsetY - 0 * scaleY;
    for (
      let i = Math.ceil(viewportX.min);
      i <= Math.floor(viewportX.max);
      i++
    ) {
      if (i !== 0) {
        const x = offsetX + i * scaleX;
        if (
          x >= 0 &&
          x <= canvasSize.width &&
          axisYPos >= 0 &&
          axisYPos <= canvasSize.height
        ) {
          ctx.beginPath();
          ctx.moveTo(x, axisYPos - 3);
          ctx.lineTo(x, axisYPos + 3);
          ctx.stroke();
        }
      }
    }

    // Vạch chia trục Y
    const axisXPos = offsetX + 0 * scaleX;
    for (
      let i = Math.ceil(viewportY.min);
      i <= Math.floor(viewportY.max);
      i++
    ) {
      if (i !== 0) {
        const y = offsetY - i * scaleY;
        if (
          y >= 0 &&
          y <= canvasSize.height &&
          axisXPos >= 0 &&
          axisXPos <= canvasSize.width
        ) {
          ctx.beginPath();
          ctx.moveTo(axisXPos - 3, y);
          ctx.lineTo(axisXPos + 3, y);
          ctx.stroke();
        }
      }
    }

    // Vẽ đồ thị hàm số
    if (graphPoints.length > 1) {
      ctx.strokeStyle = "#00ff00"; // Màu xanh lá như màn hình Casio
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      let isFirstPoint = true;

      for (const point of graphPoints) {
        const canvasX = offsetX + point.x * scaleX;
        const canvasY = offsetY - point.y * scaleY;

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
    <div className="bg-black border border-gray-600 rounded flex items-center justify-center h-[70px] sm:h-[130px] lg:h-[130px]">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="block"
      />
    </div>
  );
};

export default GraphArea;
