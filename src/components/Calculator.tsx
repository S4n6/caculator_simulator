import React, { useState, useCallback } from "react";
import Display from "./Display";
import Keypad from "./Keypad";
import WalkingCatAnimation from "./WalkingCatAnimation";
import { clickSound } from "../utils/clickSound";
import {
  evaluateExpression,
  canAddOperator,
  canAddNumber,
  formatExpression,
  convertBetweenFractionAndDecimal,
} from "../utils/calculatorUtils";
import { compile } from "mathjs";

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

  // Thêm state cho chế độ đồ thị
  const [currentMode, setCurrentMode] = useState<"calculator" | "graph">(
    "calculator"
  );
  const [functionInput, setFunctionInput] = useState<string>("");
  const [graphPoints, setGraphPoints] = useState<
    Array<{ x: number; y: number }>
  >([]);

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

    // Reset tất cả các chế độ
    setCurrentMode("calculator");
    setFunctionInput("");
    setGraphPoints([]);

    // Reset calculator state
    setExpression("");
    setResult("0");
    setLastAnswer("0");
    setIsNewCalculation(true);
    resetModes();
    clickSound.playSpecialClick();
  }, [resetModes]);

  // Hàm bật máy tính
  const turnOnCalculator = useCallback(() => {
    console.log("🟢 Turning ON calculator");
    setIsCalculatorOn(true);

    // Reset tất cả các chế độ về mặc định
    setCurrentMode("calculator");
    setFunctionInput("");
    setGraphPoints([]);

    // Reset calculator state
    setExpression("");
    setResult("0");
    setLastAnswer("0");
    setIsNewCalculation(true);
    resetModes();
    clickSound.playSpecialClick(); // Âm thanh bật máy
  }, [resetModes]);

  // Hàm xử lý đồ thị
  const calculateGraphPoints = useCallback((funcString: string) => {
    try {
      console.log("🔧 Original function string:", `"${funcString}"`);

      // Kiểm tra chuỗi hàm số có hợp lệ không
      if (!funcString || funcString.trim().length === 0) {
        console.warn("❌ Empty function string");
        setGraphPoints([]);
        return;
      }

      // Chuẩn hóa chuỗi hàm số với các bước chi tiết hơn
      let normalizedFunc = funcString.trim();

      // Loại bỏ khoảng trắng thừa
      normalizedFunc = normalizedFunc.replace(/\s+/g, "");

      // Kiểm tra xem có chứa biến x không
      if (!normalizedFunc.includes("x")) {
        console.warn("❌ Function must contain variable 'x'");
        setGraphPoints([]);
        return;
      }

      // Giữ nguyên ^ vì mathjs hỗ trợ cả ^ và **
      // Chỉ thêm * giữa số và biến (2x -> 2*x)
      normalizedFunc = normalizedFunc.replace(/(\d)([a-zA-Z])/g, "$1*$2");

      // Thêm * giữa biến và số (x2 -> x*2)
      normalizedFunc = normalizedFunc.replace(/([a-zA-Z])(\d)/g, "$1*$2");

      // Thêm * giữa ) và ( hoặc biến
      normalizedFunc = normalizedFunc.replace(/\)([a-zA-Z(])/g, ")*$1");
      normalizedFunc = normalizedFunc.replace(/([a-zA-Z])\(/g, "$1*(");

      console.log("✅ Normalized function:", `"${normalizedFunc}"`);

      // Kiểm tra xem chuỗi đã normalize có hợp lệ không
      if (normalizedFunc.length === 0) {
        console.warn("❌ Normalized function is empty");
        setGraphPoints([]);
        return;
      }

      const expr = compile(normalizedFunc);
      const points: Array<{ x: number; y: number }> = [];

      // Tính toán điểm từ -10 đến 10 với bước 0.1
      for (let x = -10; x <= 10; x += 0.1) {
        try {
          const y = expr.evaluate({ x });
          if (typeof y === "number" && !isNaN(y) && isFinite(y)) {
            points.push({ x: Math.round(x * 10) / 10, y });
          }
        } catch (error) {
          // Bỏ qua điểm lỗi
        }
      }

      setGraphPoints(points);
      console.log(
        `📊 Generated ${points.length} graph points for: ${funcString} -> ${normalizedFunc}`
      );
    } catch (error) {
      console.error("Graph calculation error:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : String(error)
      );
      setGraphPoints([]);
    }
  }, []);

  const handleCalculateGraph = useCallback(() => {
    console.log(
      "🎯 handleCalculateGraph called with functionInput:",
      functionInput
    );
    if (functionInput.trim()) {
      calculateGraphPoints(functionInput);
    } else {
      console.log("❌ No function input to calculate");
    }
  }, [functionInput, calculateGraphPoints]);

  const toggleGraphMode = useCallback(() => {
    if (currentMode === "calculator") {
      setCurrentMode("graph");
      setFunctionInput("x^2"); // Sử dụng ^ vì mathjs hiểu cả ^ và **
      calculateGraphPoints("x^2");
    } else {
      setCurrentMode("calculator");
      setFunctionInput("");
      setGraphPoints([]);
    }
    resetModes();
  }, [currentMode, resetModes, calculateGraphPoints]);

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
          console.log("🔄 ON button acting as AC (clear) and exit modes");

          // Thoát khỏi tất cả các chế độ đặc biệt
          if (currentMode === "graph") {
            setCurrentMode("calculator");
            setFunctionInput("");
            setGraphPoints([]);
            console.log("📤 Exited graph mode");
          }

          // Reset máy tính về trạng thái ban đầu
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
        if (isShiftActive) {
          // SHIFT + MODE = chuyển đổi graph mode
          toggleGraphMode();
          resetModes(); // Tắt SHIFT sau khi thực hiện
        } else {
          // MODE bình thường = reset chế độ
          resetModes();
        }
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
          if (currentMode === "graph") {
            handleGraphNumberInput(value);
          } else {
            handleNumberInput(value);
          }
          break;
        case "operator":
          if (currentMode === "graph") {
            handleGraphOperatorInput(value);
          } else {
            handleOperatorInput(value);
          }
          break;
        case "function":
        case "scientific_function_top_row":
        case "scientific_function_trig_row":
          if (currentMode === "graph") {
            handleGraphFunctionInput(value);
          } else {
            handleFunctionInput(value);
          }
          break;
        case "special":
        case "control":
        case "mode":
          if (currentMode === "graph") {
            handleGraphSpecialInput(value);
          } else {
            handleSpecialInput(value);
          }
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
      currentMode,
      functionInput,
      playSoundForButtonType,
      turnOnCalculator,
      turnOffCalculator,
      toggleShift,
      toggleAlpha,
      resetModes,
      toggleGraphMode,
      handleCalculateGraph,
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
        // Không tính toán nếu kết thúc bằng E (scientific notation chưa hoàn thành)
        if (!/\dE[+-]?$/.test(newExpression)) {
          try {
            const newResult = evaluateExpression(newExpression, lastAnswer);
            if (newResult !== "Lỗi" && newResult !== newExpression) {
              setResult(newResult);
            }
          } catch {
            // Không làm gì nếu biểu thức chưa hoàn chỉnh
          }
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
          // Kiểm tra biểu thức có hợp lệ không trước khi tính toán
          // Nếu kết thúc bằng "E" hoặc "E-" hoặc "E+" thì chưa hoàn thành
          if (/\dE[+-]?$/.test(expression.trim())) {
            setResult("Incomplete expression");
            return;
          }

          const finalResult = evaluateExpression(expression, lastAnswer);
          setResult(finalResult);
          // Lưu kết quả vào lastAnswer nếu hợp lệ
          if (
            finalResult !== "Lỗi" &&
            finalResult !== "" &&
            finalResult !== expression
          ) {
            setLastAnswer(finalResult);
          }
          setIsNewCalculation(true);
        }
        break;
    }
  };

  // Xử lý nhập liệu cho chế độ đồ thị
  const handleGraphNumberInput = (value: string) => {
    setFunctionInput((prev) => prev + value);
  };

  const handleGraphOperatorInput = (value: string) => {
    let operator = value;
    // Chuyển đổi các ký hiệu
    if (value === "×") operator = "*";
    if (value === "÷") operator = "/";
    if (value === "−") operator = "-";
    // Giữ nguyên ^ vì mathjs hỗ trợ

    console.log(`📝 Graph operator input: ${value} -> ${operator}`);
    setFunctionInput((prev) => prev + operator);
  };

  const handleGraphFunctionInput = (value: string) => {
    let func = value;
    // Xử lý các hàm đặc biệt
    if (value === "sqrt(") func = "sqrt(";
    if (value === "^2") func = "^2"; // Giữ nguyên ^2
    if (value === "^3") func = "^3"; // Giữ nguyên ^3
    if (value === "^") func = "^"; // Giữ nguyên ^

    console.log(`📝 Graph function input: ${value} -> ${func}`);
    setFunctionInput((prev) => prev + func);
  };

  const handleGraphSpecialInput = (value: string) => {
    console.log("🔧 handleGraphSpecialInput called with:", value);
    switch (value) {
      case "clear":
        setFunctionInput("x^2"); // Reset về hàm mẫu đơn giản với ^
        calculateGraphPoints("x^2");
        break;
      case "backspace":
        setFunctionInput((prev) => prev.slice(0, -1));
        break;
      case "calculate":
        console.log("📊 Calculate button pressed in graph mode");
        handleCalculateGraph();
        break;
      case "ans":
        // Trong chế độ đồ thị, nút Ans sẽ thêm "x" vào hàm số
        setFunctionInput((prev) => prev + "x");
        break;
      default:
        break;
    }
  };
  return (
    <div
      className="w-full max-w-sm mx-auto bg-slate-700 rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-800 
                    sm:max-w-md md:max-w-lg lg:max-w-xl
                    h-auto min-h-0 max-h-[92vh] 
                    my-0 sm:my-1 lg:my-1"
    >
      {/* Header với branding CASIO */}
      <div className="bg-slate-800 p-1 sm:p-1 lg:p-2 text-center">
        <div className="flex justify-between items-start mb-1 sm:mb-1 lg:mb-1">
          <div className="text-white font-bold text-sm sm:text-base lg:text-lg">
            CASIO
          </div>
          <div className="text-xs sm:text-sm text-gray-300 italic">
            fx-570ES PLUS
          </div>
        </div>

        {/* Pixel cat animation */}
        <div className="relative bg-white rounded px-1 py-1 inline-block mb-1 sm:mb-2 lg:mb-3 overflow-hidden w-full max-w-xs mx-auto">
          <WalkingCatAnimation />
        </div>
      </div>

      <Display
        expression={formatExpression(expression)}
        result={result}
        isShiftActive={isShiftActive}
        isAlphaActive={isAlphaActive}
        isCalculatorOn={isCalculatorOn}
        currentMode={currentMode}
        graphPoints={graphPoints}
        functionInput={functionInput}
      />
      <Keypad onButtonClick={handleButtonClick} />
    </div>
  );
};

export default Calculator;
