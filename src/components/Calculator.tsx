import React, { useState, useCallback } from "react";
import Display from "./Display";
import Keypad from "./Keypad";
import { clickSound } from "../utils/clickSound";
import {
  evaluateExpression,
  canAddOperator,
  canAddNumber,
  formatExpression,
  convertBetweenFractionAndDecimal,
} from "../utils/calculatorUtils";

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("0");
  const [isNewCalculation, setIsNewCalculation] = useState<boolean>(true);

  // Thêm state để lưu câu trả lời cuối cùng cho nút Ans
  const [lastAnswer, setLastAnswer] = useState<string>("0");

  // Thêm state cho chế độ SHIFT và ALPHA
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [isAlphaActive, setIsAlphaActive] = useState<boolean>(false);

  // Thêm state cho trạng thái máy tính (bật/tắt)
  const [isCalculatorOn, setIsCalculatorOn] = useState<boolean>(true);

  // Hàm phát âm thanh theo loại nút
  const playSoundForButtonType = useCallback((type: string) => {
    switch (type) {
      case "number":
        clickSound.playNumberClick();
        break;
      case "operator":
        clickSound.playOperatorClick();
        break;
      case "function":
      case "scientific_function_top_row":
      case "scientific_function_trig_row":
      case "new_scientific_function":
        clickSound.playFunctionClick();
        break;
      case "special":
      case "control":
      case "mode":
        clickSound.playSpecialClick();
        break;
      default:
        clickSound.playNumberClick();
        break;
    }
  }, []);

  // Hàm toggle các chế độ
  const toggleShift = useCallback(() => {
    if (!isCalculatorOn) return; // Không hoạt động khi máy tắt
    setIsShiftActive(!isShiftActive);
    setIsAlphaActive(false); // Tắt Alpha khi bật Shift
  }, [isShiftActive, isCalculatorOn]);

  const toggleAlpha = useCallback(() => {
    if (!isCalculatorOn) return; // Không hoạt động khi máy tắt
    setIsAlphaActive(!isAlphaActive);
    setIsShiftActive(false); // Tắt Shift khi bật Alpha
  }, [isAlphaActive, isCalculatorOn]);

  const resetModes = useCallback(() => {
    setIsShiftActive(false);
    setIsAlphaActive(false);
  }, []);

  // Hàm tắt máy tính
  const turnOffCalculator = useCallback(() => {
    console.log("🔴 Turning OFF calculator");
    setIsCalculatorOn(false);
    setExpression("");
    setResult("0");
    setLastAnswer("0");
    setIsNewCalculation(true);
    resetModes();
    clickSound.playSpecialClick(); // Âm thanh tắt máy
  }, [resetModes]);

  // Hàm bật máy tính
  const turnOnCalculator = useCallback(() => {
    console.log("🟢 Turning ON calculator");
    setIsCalculatorOn(true);
    setExpression("");
    setResult("0");
    setLastAnswer("0");
    setIsNewCalculation(true);
    resetModes();
    clickSound.playSpecialClick(); // Âm thanh bật máy
  }, [resetModes]);

  // Xử lý khi nhấn nút với logic SHIFT/ALPHA
  const handleButtonClick = useCallback(
    (
      value: string,
      type:
        | "number"
        | "operator"
        | "function"
        | "special"
        | "control"
        | "mode"
        | "scientific_function_top_row"
        | "scientific_function_trig_row"
        | "new_scientific_function"
    ) => {
      if (value === "power_on") {
        if (!isCalculatorOn) {
          turnOnCalculator();
        } else {
          console.log("🔄 ON button acting as AC (clear)");
          setExpression("");
          setResult("0");
          setIsNewCalculation(true);
          resetModes();
          playSoundForButtonType("special");
        }
        return;
      }

      if (!isCalculatorOn) {
        return;
      }

      playSoundForButtonType(type);

      if (value === "shift") {
        toggleShift();
        return;
      }

      if (value === "alpha") {
        toggleAlpha();
        return;
      }

      if (value === "mode") {
        resetModes();
        return;
      }

      if (isShiftActive && value === "clear") {
        turnOffCalculator();
        return;
      }

      // Xử lý các hàm với SHIFT
      if (isShiftActive) {
        handleShiftFunction(value, type);
        resetModes();
        return;
      }

      // Xử lý các hàm với ALPHA
      if (isAlphaActive) {
        handleAlphaFunction(value, type);
        resetModes();
        return;
      }

      // Xử lý bình thường
      switch (type) {
        case "number":
          handleNumberInput(value);
          break;
        case "operator":
          handleOperatorInput(value);
          break;
        case "function":
        case "scientific_function_top_row":
        case "scientific_function_trig_row":
          handleFunctionInput(value);
          break;
        case "special":
        case "control":
        case "mode":
          handleSpecialInput(value);
          break;
        case "new_scientific_function":
          handleNewScientificFunction(value);
          break;
      }
    },
    [
      expression,
      result,
      isNewCalculation,
      isShiftActive,
      isAlphaActive,
      isCalculatorOn,
      playSoundForButtonType,
      turnOnCalculator,
      turnOffCalculator,
      toggleShift,
      toggleAlpha,
      resetModes,
    ]
  );

  // Xử lý các chức năng khoa học mới từ fx-570ES PLUS
  const handleNewScientificFunction = (value: string) => {
    switch (value) {
      case "calc":
        // Chức năng CALC - giải phương trình
        setExpression("CALC:");
        setResult("Enter equation");
        setIsNewCalculation(false);
        break;
      case "integral":
        // Tích phân
        if (isNewCalculation) {
          setExpression("∫(");
          setIsNewCalculation(false);
        } else {
          setExpression(expression + "∫(");
        }
        break;
      case "derivative":
        // Đạo hàm
        if (isNewCalculation) {
          setExpression("d/dx(");
          setIsNewCalculation(false);
        } else {
          setExpression(expression + "d/dx(");
        }
        break;
      case "inverse":
        // Nghịch đảo x⁻¹
        if (isNewCalculation) {
          setExpression("1/(");
          setIsNewCalculation(false);
        } else {
          setExpression(expression + "^(-1)");
        }
        break;
      case "log_base":
        // Logarit cơ số bất kỳ
        if (isNewCalculation) {
          setExpression("log_");
          setIsNewCalculation(false);
        } else {
          setExpression(expression + "log_");
        }
        break;
      case "eng":
        // Engineering notation
        if (result !== "0" && result !== "Lỗi") {
          const num = parseFloat(result);
          const engNotation = num.toExponential(2);
          setResult(engNotation);
        }
        break;
      case "s_d_conversion":
        if (
          result !== "0" &&
          result !== "Lỗi" &&
          result !== "Select constant" &&
          result !== "Conversion mode"
        ) {
          const convertedResult = convertBetweenFractionAndDecimal(result);
          setResult(convertedResult);
          setExpression(convertedResult);
          setIsNewCalculation(true);
        } else {
          setResult("No value to convert");
        }
        break;
      case "npr":
        // Hoán vị nPr
        if (!isNewCalculation && expression) {
          setExpression(expression + "P");
        }
        break;
      case "sto":
        // Store to memory
        if (result !== "0" && result !== "Lỗi") {
          localStorage.setItem("calculatorMemory", result);
          setResult("Stored");
        }
        break;
      case "rcl":
        // Recall from memory
        const stored = localStorage.getItem("calculatorMemory");
        if (stored) {
          if (isNewCalculation) {
            setExpression(stored);
            setResult(stored);
            setIsNewCalculation(false);
          } else {
            setExpression(expression + stored);
          }
        }
        break;
      case "const":
        // Constants menu
        setExpression("CONST:");
        setResult("Select constant");
        break;
      case "conv":
        // Unit conversion
        setExpression("CONV:");
        setResult("Select units");
        break;
      case "clr":
        // Clear specific memory/history
        localStorage.removeItem("calculatorMemory");
        setResult("Memory cleared");
        break;
      case "e_notation":
        if (isNewCalculation && result !== "0" && result !== "Lỗi") {
          const newExpr = result + "E";
          setExpression(newExpr);
          setIsNewCalculation(false);
        } else if (expression && /[\d\.]$/.test(expression)) {
          const newExpr = expression + "E";
          setExpression(newExpr);
        } else if (!expression || expression === "0") {
          setExpression("1E");
          setIsNewCalculation(false);
        }
        break;
      case "yroot":
        // Root với số mũ tùy ý ʸ√x
        if (!isNewCalculation && expression) {
          setExpression(expression + "^(1/");
        }
        break;
      case "ln":
        // Natural logarithm
        handleFunctionInput("ln(");
        break;
      default:
        break;
    }
  };

  // Xử lý các hàm nâng cao
  const handleAdvancedFunction = (functionType: string) => {
    let newExpression = "";

    switch (functionType) {
      case "10^x":
        if (isNewCalculation) {
          newExpression = "10^(";
          setExpression(newExpression);
          setIsNewCalculation(false);
        } else {
          newExpression = expression + "10^(";
          setExpression(newExpression);
        }
        break;
      case "e":
        if (isNewCalculation) {
          newExpression = "e";
          setExpression(newExpression);
          setResult("2.718281828");
          setIsNewCalculation(false);
        } else {
          newExpression = expression + "e";
          setExpression(newExpression);
        }
        break;
      case "π":
        if (isNewCalculation) {
          newExpression = "π";
          setExpression(newExpression);
          setResult("3.141592654");
          setIsNewCalculation(false);
        } else {
          newExpression = expression + "π";
          setExpression(newExpression);
        }
        break;
    }
  };

  // Xử lý các hàm khi SHIFT được kích hoạt
  const handleShiftFunction = (value: string, type: string) => {
    switch (value) {
      case "log(":
        handleAdvancedFunction("10^x"); // SHIFT + log = 10^x
        break;
      case "e^":
        handleFunctionInput("ln("); // SHIFT + e^x = ln
        break;
      case "sin(":
        handleFunctionInput("asin("); // sin⁻¹
        break;
      case "cos(":
        handleFunctionInput("acos("); // cos⁻¹
        break;
      case "tan(":
        handleFunctionInput("atan("); // tan⁻¹
        break;
      case "^2":
        handleFunctionInput("sqrt("); // √ (căn bậc 2)
        break;
      case "^3":
        handleFunctionInput("cbrt("); // ∛ (căn bậc 3)
        break;
      case "sqrt(":
        handleFunctionInput("^2"); // x²
        break;
      case "cbrt(":
        handleFunctionInput("^3"); // x³
        break;
      case "1":
        handleAdvancedFunction("π"); // SHIFT + 1 = π
        break;
      case "2":
        handleAdvancedFunction("e"); // SHIFT + 2 = e
        break;
      case "÷":
        handleOperatorInput("^"); // SHIFT + ÷ = x^y
        break;

      default:
        // Xử lý bình thường nếu không có chức năng SHIFT đặc biệt
        switch (type) {
          case "number":
            handleNumberInput(value);
            break;
          case "operator":
            handleOperatorInput(value);
            break;
          case "function":
            handleFunctionInput(value);
            break;
        }
        break;
    }
  };

  // Xử lý các hàm khi ALPHA được kích hoạt
  const handleAlphaFunction = (value: string, type: string) => {
    switch (value) {
      case "log(":
        handleFunctionInput("exp("); // ALPHA + log = exp
        break;
      case "e^":
        handleAdvancedFunction("e"); // ALPHA + e^x = e constant
        break;
      case "1":
        handleAdvancedFunction("π"); // ALPHA + 1 = π
        break;
      case "2":
        handleAdvancedFunction("e"); // ALPHA + 2 = e
        break;
      case "sin(":
        handleFunctionInput("sinh("); // sin hyperbolic
        break;
      case "cos(":
        handleFunctionInput("cosh("); // cos hyperbolic
        break;
      case "tan(":
        handleFunctionInput("tanh("); // tan hyperbolic
        break;
      case "×":
        handleOperatorInput("!"); // ALPHA + × = factorial
        break;
      case "(":
        handleOperatorInput("["); // ALPHA + ( = [
        break;
      case ")":
        handleOperatorInput("]"); // ALPHA + ) = ]
        break;
      default:
        // Xử lý bình thường nếu không có chức năng ALPHA đặc biệt
        switch (type) {
          case "number":
            handleNumberInput(value);
            break;
          case "operator":
            handleOperatorInput(value);
            break;
          case "function":
            handleFunctionInput(value);
            break;
        }
        break;
    }
  };

  // Xử lý nhập số
  const handleNumberInput = (value: string) => {
    if (isNewCalculation) {
      setExpression(value);
      setResult(value);
      setIsNewCalculation(false);
    } else {
      if (canAddNumber(expression)) {
        const newExpression = expression + value;
        setExpression(newExpression);

        // Tính toán realtime nếu biểu thức hợp lệ
        try {
          const newResult = evaluateExpression(newExpression, lastAnswer);
          if (newResult !== "Lỗi") {
            setResult(newResult);
          }
        } catch {
          // Không làm gì nếu biểu thức chưa hoàn chỉnh
        }
      }
    }
  };

  // Xử lý nhập toán tử
  const handleOperatorInput = (value: string) => {
    if (isNewCalculation) {
      if (result !== "0" && result !== "Lỗi") {
        setExpression(result + value);
        setIsNewCalculation(false);
      }
    } else {
      if (canAddOperator(expression)) {
        setExpression(expression + value);
      } else {
        // Thay thế toán tử cuối nếu có
        const newExpression = expression.replace(/[+\-*/^×÷−]$/, "") + value;
        setExpression(newExpression);
      }
    }
  };

  // Xử lý nhập hàm
  const handleFunctionInput = (value: string) => {
    if (value === "!") {
      // Giai thừa - thêm vào cuối
      if (expression && !isNewCalculation) {
        const newExpression = expression + value;
        setExpression(newExpression);
        try {
          const newResult = evaluateExpression(newExpression, lastAnswer);
          setResult(newResult);
        } catch {
          setResult("Lỗi");
        }
      }
    } else {
      // Các hàm khác - thêm vào đầu
      if (isNewCalculation) {
        setExpression(value);
        setIsNewCalculation(false);
      } else {
        if (canAddNumber(expression)) {
          setExpression(expression + value);
        }
      }
    }
  };

  // Xử lý các phím đặc biệt
  const handleSpecialInput = (value: string) => {
    switch (value) {
      case "clear":
        setExpression("");
        setResult("0");
        setIsNewCalculation(true);
        break;

      case "backspace":
        if (!isNewCalculation && expression) {
          const newExpression = expression.slice(0, -1);
          setExpression(newExpression);

          if (newExpression === "") {
            setResult("0");
            setIsNewCalculation(true);
          } else {
            try {
              const newResult = evaluateExpression(newExpression, lastAnswer);
              if (newResult !== "Lỗi") {
                setResult(newResult);
              }
            } catch {
              // Giữ nguyên result nếu biểu thức chưa hoàn chỉnh
            }
          }
        }
        break;

      case "ans":
        console.log("🔄 Recalling last answer:", lastAnswer);
        // Answer/Result recall - hiển thị "Ans" trên màn hình
        if (lastAnswer !== "0" && lastAnswer !== "Lỗi" && lastAnswer !== "") {
          if (isNewCalculation) {
            setExpression("Ans");
            setResult(lastAnswer); // Hiển thị giá trị thực tế ở result
            setIsNewCalculation(false);
          } else {
            setExpression(expression + "Ans");
          }
        }
        break;

      case "negate":
        if (result !== "0" && result !== "Lỗi") {
          if (isNewCalculation) {
            const negated = result.startsWith("-")
              ? result.slice(1)
              : "-" + result;
            setResult(negated);
            setExpression(negated);
          } else {
            // Thêm dấu trừ vào đầu biểu thức hoặc loại bỏ nếu đã có
            if (expression.startsWith("-")) {
              setExpression(expression.slice(1));
            } else {
              setExpression("-" + expression);
            }
          }
        }
        break;

      case "calculate":
        if (expression && !isNewCalculation) {
          const finalResult = evaluateExpression(expression, lastAnswer);
          setResult(finalResult);
          // Lưu kết quả vào lastAnswer nếu hợp lệ
          if (finalResult !== "Lỗi" && finalResult !== "") {
            setLastAnswer(finalResult);
          }
          setIsNewCalculation(true);
        }
        break;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-slate-700 rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-800">
      {/* Header với branding CASIO */}
      <div className="bg-slate-800 p-4 text-center">
        <div className="flex justify-between items-start mb-3">
          <div className="text-white font-bold text-lg">CASIO</div>
          <div className="text-sm text-gray-300 italic">fx-570ES PLUS</div>
        </div>

        {/* Digital clock display */}
        <div className="bg-black rounded px-4 py-2 inline-block mb-3">
          <span className="text-red-400 font-mono text-xl font-bold">
            19:48:15
          </span>
        </div>
      </div>

      <Display
        expression={formatExpression(expression)}
        result={result}
        isShiftActive={isShiftActive}
        isAlphaActive={isAlphaActive}
        isCalculatorOn={isCalculatorOn}
      />
      <Keypad onButtonClick={handleButtonClick} />
    </div>
  );
};

export default Calculator;
