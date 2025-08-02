# VanillaJS Calculator

A clean, responsive calculator built with vanilla JavaScript, HTML, and CSS. This project demonstrates modern JavaScript practices without any runtime dependencies, featuring a polished UI and keyboard support.

## Features

- **Basic Operations**: Addition, subtraction, multiplication, and division
- **Advanced Features**: 
  - Decimal number support with smart precision handling
  - Negative number support with +/- toggle
  - Expression evaluation following proper order of operations
- **Keyboard Support**: Full keyboard navigation and input
  - Numbers: `0-9`
  - Operations: `+`, `-`, `*`, `/`
  - Decimal: `.`
  - Equals: `Enter`
  - Clear: `Escape`
  - Toggle sign: `o`
- **Smart Display**: 
  - Maximum 17-character display capacity
  - Automatic precision adjustment for decimal numbers
  - Overflow and divide-by-zero error handling
- **User Experience**:
  - Visual button feedback on keyboard press
  - Backspace support for corrections
  - Clear button (AC) to reset calculator
  - Solution persistence until new number input

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vanillajs-calculator.git
cd vanillajs-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm start
```

4. Open `dist/index.html` in your web browser

### Development

The project uses Webpack for bundling. Due to Node.js v17+ OpenSSL changes, the build script includes the `--openssl-legacy-provider` flag.

### Testing

Run the test suite with Jest:
```bash
npm test
```

## Project Structure

```
vanillajs-calculator/
├── dist/                   # Built files
│   ├── index.html         # Main HTML file
│   ├── style.css          # Styles
│   └── main.js            # Bundled JavaScript
├── src/                    # Source files
│   ├── index.js           # Entry point
│   ├── scripts/
│   │   ├── dom.js         # DOM manipulation and UI logic
│   │   └── utils.js       # Calculator logic and utilities
│   └── __tests__/         # Test files
│       ├── dom.test.js
│       └── utils.test.js
├── webpack.config.js       # Webpack configuration
└── package.json           # Project dependencies
```

## Technical Implementation

### Architecture

- **Separation of Concerns**: Business logic (`utils.js`) is separated from DOM manipulation (`dom.js`)
- **Expression Parsing**: Uses infix-to-postfix conversion (Shunting Yard algorithm) for proper operation precedence
- **Error Handling**: Graceful handling of edge cases like division by zero and number overflow
- **Event-Driven**: Clean event listener architecture for both button clicks and keyboard input

### Key Functions

- `initButtonClickListeners()`: Sets up all event listeners
- `solveExpression()`: Evaluates mathematical expressions
- `printToDisplay()`: Manages display updates with syntax checking
- `checkSyntaxOnInput()`: Validates input in real-time
- `switchSign()`: Toggles positive/negative for current number

## Browser Compatibility

Works on all modern browsers that support ES6+ features:
- Chrome 60+
- Firefox 54+
- Safari 10.1+
- Edge 79+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Acknowledgments

- Built as a demonstration of clean vanilla JavaScript practices
- No external runtime dependencies for maximum performance
- Focuses on accessibility and user experience