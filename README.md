# 🧮 Casio fx-570ES PLUS Calculator Simulator

A fully functional web-based calculator simulator that replicates the Casio fx-570ES PLUS scientific calculator with modern React technology.

## ✨ Features

### 🎯 Core Calculator Functions

- **Basic arithmetic operations** (+, -, ×, ÷)
- **Scientific functions** (sin, cos, tan, log, ln, sqrt, etc.)
- **Advanced operations** (factorial, powers, roots, derivatives, integrals)
- **Memory functions** (STO, RCL, CLR)
- **Engineering notation** and unit conversions
- **Real-time calculation** with live result preview

### 🎨 Interactive Interface

- **Pixel cat animation** walking across the display header
- **Opening assembly animation** with "lắp ráp" effect
- **Audio feedback** with realistic button click sounds
- **SHIFT/ALPHA modes** for extended functionality
- **Graph mode** with function plotting capabilities

### 📱 Responsive Design

- **Mobile-optimized** touch interface
- **Desktop-friendly** keyboard navigation
- **Tablet support** with adaptive layouts
- **Viewport-aware** sizing and spacing

### 🎮 Special Modes

- **Graph Mode**: Plot mathematical functions with interactive canvas
- **Scientific Notation**: Handle large and small numbers
- **Mode switching**: SHIFT + MODE to toggle between calculator and graph modes

## 🚀 Tech Stack

- **React 19.1.0** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Math.js** - Mathematical expression evaluation
- **Canvas API** - Graph plotting and visualization

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/S4n6/caculator_simulator.git

# Navigate to project directory
cd caculator_simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Usage

### Basic Calculator Mode

1. **Power on**: Click the green "ON" button
2. **Input**: Click number and operator buttons
3. **Calculate**: Press "=" for results
4. **Clear**: Use "AC" to clear all or "DEL" to backspace

### Graph Mode

1. **Enter graph mode**: Press SHIFT + MODE
2. **Input function**: Enter mathematical function using x variable (e.g., x^2, sin(x))
3. **Plot**: Press "=" to generate graph
4. **Exit**: Press ON button to return to calculator mode

### Special Functions

- **SHIFT**: Hold to access secondary functions (yellow text)
- **ALPHA**: Access alphabetic and advanced functions
- **Memory**: Use STO to store, RCL to recall values
- **Ans**: Recall last calculated result

## 🎨 Animations

- **Opening Animation**: 6-phase assembly sequence with particles and logo fly-ins
- **Walking Cat**: Animated pixel cat moving bidirectionally across the display
- **Button Feedback**: Visual and audio feedback for all interactions

## 📱 Mobile Features

- **Touch-optimized**: Button sizes optimized for touch input
- **Viewport fitting**: Calculator fits perfectly in mobile screens
- **Responsive layout**: Adapts to different screen orientations
- **Smooth scrolling**: When needed for larger content

## 🔧 Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Calculator.tsx    # Main calculator component
│   ├── Display.tsx       # LCD display with modes
│   ├── Keypad.tsx        # Button grid layout
│   ├── GraphArea.tsx     # Graph plotting canvas
│   ├── OpeningAnimation.tsx  # Assembly animation
│   └── WalkingCatAnimation.tsx  # Pixel cat animation
├── utils/               # Utility functions
│   ├── calculatorUtils.ts   # Math operations
│   └── clickSound.ts        # Audio feedback
├── assets/              # Static assets
│   ├── meo1.png, meo2.png, meo3.png  # Cat animation frames
│   └── react.svg
└── main.tsx            # Application entry point
```

## 🎵 Audio System

The calculator includes realistic button click sounds:

- **Number buttons**: Soft click sound
- **Operators**: Distinct operation sound
- **Functions**: Scientific function sound
- **Special actions**: System sounds for power/clear

## 🐱 Easter Egg

Watch for the animated pixel cat walking across the calculator display - it's a delightful addition that brings personality to the scientific calculator!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the real Casio fx-570ES PLUS calculator
- Built with modern web technologies for educational purposes
- Special thanks to the React and TypeScript communities

---

**Made with ❤️ and ☕ by S4n6**
