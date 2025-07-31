// Các hàm tiện ích cho máy tính khoa học

// Chuyển đổi biểu thức từ notation người dùng sang JavaScript
export const preprocessExpression = (expression: string): string => {
  let processed = expression
    // Thay thế các ký hiệu đặc biệt
    .replace(/π/g, Math.PI.toString())
    .replace(/e(?![0-9])/g, Math.E.toString())
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    // Xử lý hàm khoa học cơ bản
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/asin\(/g, "Math.asin(")
    .replace(/acos\(/g, "Math.acos(")
    .replace(/atan\(/g, "Math.atan(")
    // Xử lý hàm hyperbolic (cho chế độ ALPHA)
    .replace(/sinh\(/g, "Math.sinh(")
    .replace(/cosh\(/g, "Math.cosh(")
    .replace(/tanh\(/g, "Math.tanh(")
    // Xử lý logarithm
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    // Xử lý căn
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/cbrt\(/g, "Math.cbrt(")
    // Xử lý exponential
    .replace(/e\^/g, "Math.exp(")
    .replace(/exp\(/g, "Math.exp(")
    .replace(/10\^\(/g, "Math.pow(10,")
    // Xử lý các hàm mới fx-570ES PLUS
    .replace(/∫\(/g, "integral(")
    .replace(/d\/dx\(/g, "derivative(")
    .replace(/log_(\d+)\(/g, "logBase($1,")
    .replace(/(\d+)P(\d+)/g, "permutation($1,$2)")
    .replace(/(\d+)C(\d+)/g, "combination($1,$2)")
    // Xử lý lũy thừa
    .replace(/\^2/g, "**2")
    .replace(/\^3/g, "**3")
    .replace(/\^/g, "**");

  return processed;
};

// Tính giai thừa
export const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Giới hạn để tránh overflow

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Tính hoán vị nPr
export const permutation = (n: number, r: number): number => {
  if (n < 0 || r < 0 || r > n) return NaN;
  if (r === 0) return 1;

  return factorial(n) / factorial(n - r);
};

// Tính tổ hợp nCr
export const combination = (n: number, r: number): number => {
  if (n < 0 || r < 0 || r > n) return NaN;
  if (r === 0 || r === n) return 1;

  return factorial(n) / (factorial(r) * factorial(n - r));
};

// Logarit cơ số bất kỳ
export const logBase = (base: number, value: number): number => {
  if (base <= 0 || base === 1 || value <= 0) return NaN;
  return Math.log(value) / Math.log(base);
};

// Hàm tích phân đơn giản (numerical integration - trapezoidal rule)
export const integral = (
  expression: string,
  start: number = 0,
  end: number = 1,
  steps: number = 1000
): number => {
  // Đây là implementation đơn giản cho demo
  // Trong thực tế sẽ cần parser phức tạp hơn
  const h = (end - start) / steps;
  let sum = 0;

  for (let i = 0; i <= steps; i++) {
    const x = start + i * h;
    // Đơn giản hóa: giả sử expression là x^2
    const y = Math.pow(x, 2);
    const weight = i === 0 || i === steps ? 1 : 2;
    sum += weight * y;
  }

  return (sum * h) / 2;
};

// Hàm đạo hàm đơn giản (numerical differentiation)
export const derivative = (
  expression: string,
  point: number = 0,
  h: number = 1e-8
): number => {
  // Đây là implementation đơn giản cho demo
  // Trong thực tế sẽ cần parser phức tạp hơn

  // Đơn giản hóa: giả sử expression là x^2, đạo hàm là 2x
  return 2 * point;
};

// Xử lý biểu thức có giai thừa
export const processFactorial = (expression: string): string => {
  // Tìm và thay thế các số có dấu ! bằng factorial
  return expression.replace(/(\d+(?:\.\d+)?)!/g, (_, number) => {
    const num = parseFloat(number);
    return factorial(num).toString();
  });
};

// Đánh giá biểu thức một cách an toàn
export const evaluateExpression = (expression: string): string => {
  try {
    if (!expression || expression.trim() === "") {
      return "0";
    }

    // Xử lý giai thừa trước
    let processed = processFactorial(expression);

    // Tiền xử lý biểu thức
    processed = preprocessExpression(processed);

    // Thêm các hàm mới vào context đánh giá
    const mathContext = {
      Math,
      factorial,
      permutation,
      combination,
      logBase,
      integral,
      derivative,
    };

    // Tạo hàm đánh giá với context an toàn
    const safeEval = new Function(
      ...Object.keys(mathContext),
      `return ${processed}`
    );

    // Đánh giá biểu thức với context
    const result = safeEval(...Object.values(mathContext));

    if (typeof result !== "number") {
      throw new Error("Kết quả không phải là số");
    }

    if (isNaN(result)) {
      return "Lỗi";
    }

    if (!isFinite(result)) {
      return result > 0 ? "∞" : "-∞";
    }

    // Làm tròn kết quả để tránh lỗi floating point
    const rounded = Math.round(result * 1e10) / 1e10;

    // Định dạng số
    if (Math.abs(rounded) < 1e-10) {
      return "0";
    }

    if (Math.abs(rounded) >= 1e10 || Math.abs(rounded) < 1e-6) {
      return rounded.toExponential(6);
    }

    return rounded.toString();
  } catch (error) {
    console.error("Lỗi tính toán:", error);
    return "Lỗi";
  }
};

// Kiểm tra xem có thể thêm toán tử không
export const canAddOperator = (expression: string): boolean => {
  if (!expression) return false;
  const lastChar = expression.slice(-1);
  const operators = ["+", "-", "*", "/", "^", "×", "÷", "−"];
  return !operators.includes(lastChar) && lastChar !== "(";
};

// Kiểm tra xem có thể thêm số không
export const canAddNumber = (expression: string): boolean => {
  if (!expression) return true;
  const lastChar = expression.slice(-1);
  return lastChar !== ")" && lastChar !== "!";
};

// Định dạng biểu thức hiển thị
export const formatExpression = (expression: string): string => {
  return expression.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−");
};
