# VanillaJS Calculator

A modern, accessible calculator built with vanilla JavaScript, HTML, and CSS. This project demonstrates best practices in web development including BEM methodology, comprehensive testing, accessibility features, and performance optimizations—all without runtime dependencies.

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
  - Ripple animations on button interactions
  - Backspace support for corrections
  - Clear button (AC) to reset calculator
  - Solution persistence until new number input
  - Dark mode support (follows system preference)
  - Responsive design for all device sizes

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

The project includes comprehensive testing:

```bash
# Run all tests
npm test

# Run visual regression tests
npm run test:visual

# Update visual regression snapshots
npm run test:visual:update
```

- **Unit Tests**: 41 tests covering all calculator logic and DOM interactions
- **Visual Regression Tests**: 20 snapshot tests ensuring UI consistency

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
│       ├── utils.test.js
│       └── visual-regression/  # Visual regression tests
│           ├── calculator.visual.test.js
│           └── __image_snapshots__/  # Visual test baselines
├── webpack.config.js       # Webpack configuration
└── package.json           # Project dependencies
```

## Technical Implementation

### Architecture

- **Separation of Concerns**: Business logic (`utils.js`) is separated from DOM manipulation (`dom.js`)
- **Expression Parsing**: Uses infix-to-postfix conversion (Shunting Yard algorithm) for proper operation precedence
- **Error Handling**: Graceful handling of edge cases like division by zero and number overflow
- **Event-Driven**: Clean event listener architecture for both button clicks and keyboard input
- **BEM Methodology**: Consistent class naming convention for maintainable CSS
- **Accessibility First**: WCAG 2.1 Level AA compliant with ARIA labels and keyboard navigation

### Key Functions

- `initButtonClickListeners()`: Sets up all event listeners
- `solveExpression()`: Evaluates mathematical expressions
- `printToDisplay()`: Manages display updates with syntax checking
- `checkSyntaxOnInput()`: Validates input in real-time
- `switchSign()`: Toggles positive/negative for current number

## Key Technologies & Best Practices

### CSS Architecture
- **BEM Methodology**: Consistent naming convention (`calculator__button--modifier`)
- **CSS Custom Properties**: Design system with semantic color and spacing tokens
- **Performance Optimizations**: CSS containment, will-change, and isolation properties
- **Dark Mode**: Automatic theme switching based on system preference
- **Responsive Design**: Mobile-first approach with fluid layouts

### Accessibility Features
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Keyboard Navigation**: Full keyboard support with visual indicators
- **Focus Management**: Enhanced focus states with multiple fallbacks
- **High Contrast Support**: Works with Windows High Contrast mode
- **Screen Reader Friendly**: Live regions for calculation announcements

### Testing Strategy
- **Unit Testing**: Jest tests for all business logic and DOM interactions
- **Visual Regression Testing**: Puppeteer + jest-image-snapshot for UI consistency
- **Cross-Browser Testing**: Ensures compatibility across modern browsers

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

## Recent Improvements

- ✨ Modernized CSS with custom properties and dark mode support
- ♿ Enhanced accessibility with ARIA labels and keyboard navigation
- 🎨 Added ripple animations for better user feedback
- 📐 Refactored to BEM methodology for maintainable CSS
- 🧪 Implemented visual regression testing suite
- 🚀 Performance optimizations with CSS containment
- 📱 Improved responsive design for all screen sizes

## Acknowledgments

- Built as a demonstration of modern web development best practices
- No external runtime dependencies for maximum performance
- Focuses on accessibility, performance, and user experience
- Comprehensive test coverage ensuring reliability