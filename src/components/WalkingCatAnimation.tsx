import React, { useState, useEffect } from "react";
import meo1 from "../assets/meo1.png";
import meo2 from "../assets/meo2.png";
import meo3 from "../assets/meo3.png";

const WalkingCatAnimation: React.FC = () => {
  // Mảng chứa các frame của mèo
  const catFrames = [meo1, meo2, meo3];

  // State quản lý animation
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isMovingRight, setIsMovingRight] = useState(true);
  const [xPosition, setXPosition] = useState(-40); // Bắt đầu từ ngoài màn hình bên trái

  // Cấu hình animation
  const frameSpeed = 200; // Thời gian giữa các frame (ms)
  const moveSpeed = 1; // Pixel di chuyển mỗi frame
  const containerWidth = 280; // Chiều rộng container (px)
  const catWidth = 32; // Chiều rộng của mèo (px)

  // Tính toán giới hạn di chuyển
  const minX = -catWidth; // Biến mất hoàn toàn bên trái
  const maxX = containerWidth; // Biến mất hoàn toàn bên phải

  // Effect để cập nhật frame animation (bước đi)
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % catFrames.length);
    }, frameSpeed);

    return () => clearInterval(frameInterval);
  }, [catFrames.length]);

  // Effect để cập nhật vị trí di chuyển
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setXPosition((prevX) => {
        let newX = prevX;

        if (isMovingRight) {
          newX = prevX + moveSpeed;
          // Khi đến biên phải, chuyển hướng
          if (newX >= maxX) {
            setIsMovingRight(false);
            return maxX;
          }
        } else {
          newX = prevX - moveSpeed;
          // Khi đến biên trái, chuyển hướng
          if (newX <= minX) {
            setIsMovingRight(true);
            return minX;
          }
        }

        return newX;
      });
    }, 16); // ~60fps cho chuyển động mượt mà

    return () => clearInterval(moveInterval);
  }, [isMovingRight, moveSpeed, minX, maxX]);

  return (
    <div className="relative w-full h-8 overflow-hidden">
      <div
        className="absolute transition-none"
        style={{
          bottom: "2px",
          left: `${xPosition}px`,
          width: `${catWidth}px`,
          height: "28px",
          transform: isMovingRight ? "scaleX(1)" : "scaleX(-1)",
          transformOrigin: "center",
        }}
      >
        <img
          src={catFrames[currentFrameIndex]}
          alt="Walking Pixel Cat"
          className="block h-full w-auto object-contain"
          style={{
            imageRendering: "pixelated", // Giữ được độ sắc nét của pixel art
          }}
          onError={(e) => {
            console.log(
              "Cat frame failed to load:",
              catFrames[currentFrameIndex]
            );
            e.currentTarget.style.display = "none";
          }}
          onLoad={() => console.log("Cat frame loaded:", currentFrameIndex)}
        />
      </div>
    </div>
  );
};

export default WalkingCatAnimation;
