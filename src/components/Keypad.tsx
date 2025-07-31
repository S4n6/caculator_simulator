import React from "react";

interface KeypadProps {
  onButtonClick: (
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
  ) => void;
}

interface ButtonConfig {
  label: string;
  value: string;
  type:
    | "number"
    | "operator"
    | "function"
    | "special"
    | "control"
    | "mode"
    | "scientific_function_top_row"
    | "scientific_function_trig_row"
    | "new_scientific_function";
  className: string;
  colSpan?: number;
  rowSpan?: number;
  secondaryText?: string;
  secondaryTextColor?: string;
}

const Keypad: React.FC<KeypadProps> = ({ onButtonClick }) => {
  // Layout theo hình ảnh Casio fx-350MS với bổ sung tất cả chức năng fx-570ES PLUS
  const buttons: ButtonConfig[] = [
    // Hàng 0: SHIFT, ALPHA, MODE
    {
      label: "SHIFT",
      value: "shift",
      type: "mode",
      className:
        "bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold border border-orange-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "ALPHA",
      value: "alpha",
      type: "mode",
      className:
        "bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold border border-blue-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "MODE",
      value: "mode",
      type: "mode",
      className:
        "bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold border border-purple-400 rounded-md shadow-md active:brightness-90",
    },
    // 3 ô trống để căn chỉnh
    { label: "", value: "", type: "special", className: "invisible" },
    { label: "", value: "", type: "special", className: "invisible" },
    { label: "", value: "", type: "special", className: "invisible" },

    // Hàng 1: CALC, SOLVE, ∫, d/dx, x⁻¹, log_base
    {
      label: "CALC",
      value: "calc",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "SOLVE",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "∫",
      value: "integral",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "d/dx",
      value: "derivative",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "x⁻¹",
      value: "inverse",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "logₐb",
      value: "log_base",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "10ˣ",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "ln",
      value: "ln",
      type: "scientific_function_top_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "eˣ",
      secondaryTextColor: "text-yellow-400",
    },

    // Hàng 2: (-), ENG, (, ), S⇔D, nPr
    {
      label: "(-)",
      value: "negate",
      type: "special",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium border border-gray-400 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "ENG",
      value: "eng",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "(",
      value: "(",
      type: "operator",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white text-lg font-bold border border-gray-400 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: ")",
      value: ")",
      type: "operator",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white text-lg font-bold border border-gray-400 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "S⇔D",
      value: "s_d_conversion",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "nPr",
      value: "npr",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "nCr",
      secondaryTextColor: "text-red-400",
    },

    // Hàng 3: x!, √, x², log, ln, sin
    {
      label: "x!",
      value: "!",
      type: "function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "√",
      value: "sqrt(",
      type: "scientific_function_top_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-lg font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "x²",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "x³",
      value: "^3",
      type: "scientific_function_top_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "∛",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "log",
      value: "log(",
      type: "scientific_function_top_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "10ˣ",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "ln",
      value: "ln(",
      type: "scientific_function_top_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "eˣ",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "sin",
      value: "sin(",
      type: "scientific_function_trig_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "sin⁻¹",
      secondaryTextColor: "text-yellow-400",
    },

    // Hàng 4: STO, RCL, CONST, CONV, CLR, cos
    {
      label: "STO",
      value: "sto",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "RCL",
      value: "rcl",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "CONST",
      value: "const",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "CONV",
      value: "conv",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "CLR",
      value: "clr",
      type: "new_scientific_function",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
    },
    {
      label: "cos",
      value: "cos(",
      type: "scientific_function_trig_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "cos⁻¹",
      secondaryTextColor: "text-yellow-400",
    },

    // Hàng 5: 7, 8, 9, DEL, AC, tan
    {
      label: "7",
      value: "7",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "8",
      value: "8",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "9",
      value: "9",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "DEL",
      value: "backspace",
      type: "special",
      className:
        "bg-red-500 hover:bg-red-600 text-white font-bold text-sm border border-red-400 rounded-md shadow-md active:brightness-90",
      secondaryText: "INS",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "AC",
      value: "clear",
      type: "special",
      className:
        "bg-red-400 hover:bg-red-500 text-white font-bold text-sm border border-red-300 rounded-md shadow-md active:brightness-90",
      secondaryText: "OFF",
      secondaryTextColor: "text-yellow-400",
    },
    {
      label: "tan",
      value: "tan(",
      type: "scientific_function_trig_row",
      className:
        "bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium border border-slate-500 rounded-md shadow-sm active:brightness-90",
      secondaryText: "tan⁻¹",
      secondaryTextColor: "text-yellow-400",
    },

    // Hàng 6: 4, 5, 6, ×, ÷, ∧
    {
      label: "4",
      value: "4",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "5",
      value: "5",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "6",
      value: "6",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "×",
      value: "×",
      type: "operator",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg border border-gray-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "÷",
      value: "÷",
      type: "operator",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg border border-gray-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "xʸ",
      value: "^",
      type: "operator",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold border border-gray-400 rounded-md shadow-md active:brightness-90",
    },

    // Hàng 7: 1, 2, 3, +, -, √ʸ
    {
      label: "1",
      value: "1",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "2",
      value: "2",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "3",
      value: "3",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "+",
      value: "+",
      type: "operator",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg border border-gray-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "−",
      value: "−",
      type: "operator",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg border border-gray-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "ʸ√x",
      value: "yroot",
      type: "function",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold border border-gray-400 rounded-md shadow-md active:brightness-90",
    },

    // Hàng 8: 0, ., ×10ˣ, Ans, =, M+
    {
      label: "0",
      value: "0",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
      colSpan: 2,
    },
    {
      label: ".",
      value: ".",
      type: "number",
      className:
        "bg-gray-400 hover:bg-gray-500 text-black font-bold text-lg border border-gray-300 rounded-md shadow-md active:scale-95",
    },
    {
      label: "×10ˣ",
      value: "e_notation",
      type: "function",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold border border-gray-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "Ans",
      value: "ans",
      type: "special",
      className:
        "bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold border border-gray-400 rounded-md shadow-md active:brightness-90",
    },
    {
      label: "=",
      value: "calculate",
      type: "special",
      className:
        "bg-gray-600 hover:bg-gray-700 text-white font-bold text-xl border border-gray-500 rounded-md shadow-md active:brightness-90",
      rowSpan: 2,
    },
  ];

  const renderButton = (button: ButtonConfig, index: number) => {
    if (button.className === "invisible") {
      return <div key={index} className="invisible"></div>;
    }

    return (
      <button
        key={index}
        onClick={() => onButtonClick(button.value, button.type)}
        className={`h-12 ${button.className} transition-colors duration-150 flex flex-col items-center justify-center relative`}
        style={{
          gridColumn: button.colSpan ? `span ${button.colSpan}` : "span 1",
          gridRow: button.rowSpan ? `span ${button.rowSpan}` : "span 1",
        }}
      >
        {button.secondaryText && (
          <span
            className={`text-xs font-normal ${button.secondaryTextColor} leading-none`}
          >
            {button.secondaryText}
          </span>
        )}
        <span className={button.secondaryText ? "text-xs leading-none" : ""}>
          {button.label}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-slate-700 p-4 rounded-b-3xl">
      {/* Grid layout thống nhất 6 cột cho tất cả các hàng */}
      <div className="grid grid-cols-6 gap-2">
        {buttons.map((button, index) => renderButton(button, index))}
      </div>
    </div>
  );
};

export default Keypad;
