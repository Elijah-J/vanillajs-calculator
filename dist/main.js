/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  checkSyntaxOnSolve,
  tokenize,
  normalizeSymbols,
  convertFromInfixToPostfix,
  evaluatePostfixExpression,
  isCalcNumber,
  isOperator,
} = __webpack_require__(2);

const MAX_DISPLAY_CAPCITY = 17;
const MAX_DIGITS_WITH_DECIMAL = MAX_DISPLAY_CAPCITY - 1; // to account for negative sign
const MAX_DECIMAL_PRECISION = 16;

let solutionDisplaying = false;
let errorDisplaying = false;

// tested
const initButtonClickListeners = () => {
  initTokenButtons();
  initClearButton();
  initBackspaceButton();
  initOppositeButton();
  initSolveButton();

  initKeyboardEventListeners();

  document.getElementById("display").innerText = "";
};

const initTokenButtons = () => {
  let tokenButtons = document.getElementsByClassName("calculator-token");

  [...tokenButtons].forEach((tokenButton) => {
    tokenButton.onclick = function () {
      printToDisplay(tokenButton.innerText);
    };
  });
};

const initClearButton = () => {
  let clearButton = document.getElementById("clear-expression");
  clearButton.onclick = clearDisplay;
};

const initBackspaceButton = () => {
  let backspaceButton = document.getElementById("backspace");
  backspaceButton.onclick = removeLastCharacter;
};

const initOppositeButton = () => {
  let oppositeButton = document.getElementById("calculator-opposite");
  oppositeButton.onclick = switchSign;
};

const initSolveButton = () => {
  let solveButton = document.getElementById("=");
  solveButton.onclick = function () {
    calculateAndPrintSolution(document.getElementById("display").innerText);
  };
};

const initKeyboardEventListeners = () => {
  document.addEventListener("keydown", clickButton);
  document.addEventListener("keyup", deactivateButton);
};

// tested
const clickButton = (e, container = window.document) => {
  const clickedButton = getButtonFromKeyEventCode(e, container);
  if (clickButton !== null) {
    clickedButton.classList.toggle("calculator-button-active");
    clickedButton.click();

    return clickedButton;
  }
};

// tested
const deactivateButton = (e, container = window.document) => {
  const clickedButton = getButtonFromKeyEventCode(e, container);
  if (clickButton !== null) {
    clickedButton.classList.remove("calculator-button-active");

    return clickedButton;
  }
};

// tested
const getButtonFromKeyEventCode = (e, container = window.document) => {
  let keyName = e.key.toString().toLowerCase();

  preventDefaultBehavior(e, keyName);
  clickedButton = doGetButton(keyName, container);

  return clickedButton;
};

const preventDefaultBehavior = (e, keyName) => {
  if (keyName === "enter" || keyName == "space") {
    e.preventDefault();
  }
};

const doGetButton = (keyName, container = window.document) => {
  let clickedButton = null;
  if (keyName === "enter") {
    clickedButton = container.getElementById("=");
  } else if (keyName === "escape") {
    clickedButton = container.getElementById("clear-expression");
  } else if (keyName === "o") {
    clickedButton = container.getElementById("calculator-opposite");
  } else {
    clickedButton = container.getElementById(keyName);
  }
  return clickedButton;
};

// tested
const printToDisplay = (symbol, container = window.document) => {
  if (errorDisplaying === true && errorDisplaying != undefined) {
    // TODO: extract this logic
    clearDisplay(null, container);
    errorDisplaying = false;
  }

  if (!isOperator(symbol)) {
    solutionDisplaying = clearSolution(container);
  }
  solutionDisplaying = false;

  let display = container.getElementById("display");
  if (
    display.innerText.length >= MAX_DISPLAY_CAPCITY ||
    !checkSyntaxOnInput(symbol, container)
  )
    return;

  doPrintToDisplay(symbol, display);
};

const doPrintToDisplay = (symbol, display) => {
  if (/\d/.test(symbol)) {
    display.innerText += `${symbol}`;
  } else if (/^\.$/.test(symbol)) {
    display.innerText += `${symbol}`;
  } else {
    display.innerText += `\xa0${symbol}\xa0`;
  }
};

// tested
const checkSyntaxOnInput = (symbol, container = window.document) => {
  const display = container.getElementById("display");
  let tokenizedDisplayText = tokenize(display.innerText);
  let normalizedDisplayText = normalizeSymbols(tokenizedDisplayText);

  if ("+-x\u00F7".indexOf(symbol) !== -1) {
    if (
      !isCalcNumber(normalizedDisplayText[normalizedDisplayText.length - 1])
    ) {
      return false;
    }
  } else if (/^\.$/.test(symbol)) {
    if (
      normalizedDisplayText[normalizedDisplayText.length - 1].indexOf(".") !=
        -1 ||
      !/^\d+$/.test(display.innerText[display.innerText.length - 1])
    ) {
      return false;
    }
  }
  return true;
};

// tested
const clearDisplay = (e, container = window.document) => {
  container.getElementById("display").innerText = "";
};

// tested
const removeLastCharacter = (e, container = window.document) => {
  if (errorDisplaying === true && errorDisplaying != undefined) {
    clearDisplay(null, container);
    errorDisplaying = false;
  }

  solutionDisplaying = false;

  let display = container.getElementById("display");
  let charactersToRemove = 1;

  if (/\s/.test(display.innerText[display.innerText.length - 1]))
    charactersToRemove = 2;

  do {
    display.innerText = display.innerText.slice(
      0,
      display.innerText.length - charactersToRemove
    );
    charactersToRemove = 1;
  } while (/(\s|-|\.)/.test(display.innerText[display.innerText.length - 1]));
  if (
    "+-x\u00F7".indexOf(display.innerText[display.innerText.length - 1]) !== -1
  ) {
    document.getElementById("display").innerText += "\xa0";
  }
};

// tested
const printSolution = (solution, container = window.document) => {
  let display = container.getElementById("display");
  let stringSolution = solution.toString();

  if (stringSolution.includes(".")) {
    let symbolsBeforeMantissa = solution.toString().split(".")[0].length + 1;
    let mantissaLength = solution.toString().split(".")[1].length;

    if (stringSolution.length > MAX_DIGITS_WITH_DECIMAL) {
      solution = parseFloat(
        solution.toFixed(MAX_DIGITS_WITH_DECIMAL - symbolsBeforeMantissa)
      );
    } else if (mantissaLength < MAX_DECIMAL_PRECISION) {
      solution = parseFloat(solution.toFixed(mantissaLength));
    } else {
      solution = parseFloat(solution.toFixed(MAX_DECIMAL_PRECISION));
    }
  } else if (stringSolution.length > MAX_DIGITS_WITH_DECIMAL) {
    solution = "Overflow";
    errorDisplaying = true;
  } else if (!Number.isFinite(solution)) {
    // TODO: extract this logic
    solution = "Divide by Zero";
    errorDisplaying = true;
  }

  display.innerText = solution + "";

  if (errorDisplaying === false) {
    solutionDisplaying = true;
  }
};

// tested
const switchSign = (
  e,
  container = window.document,
  currentErrorState = errorDisplaying
) => {
  if (currentErrorState === true && currentErrorState != undefined) {
    clearDisplay(null, container);
    errorDisplaying = false;
    return;
  }
  solutionDisplaying = false;

  let tokenizedDisplay = tokenize(
    container.getElementById("display").innerText
  );

  let currentSymbol = tokenizedDisplay[tokenizedDisplay.length - 1];
  if (isCalcNumber(currentSymbol)) {
    if (currentSymbol.charAt(0) === "-") {
      currentSymbol = currentSymbol.slice(1, currentSymbol.length);
    } else {
      currentSymbol = "-" + currentSymbol;
    }

    tokenizedDisplay[tokenizedDisplay.length - 1] = currentSymbol;
    container.getElementById("display").innerText = tokenizedDisplay.join(" ");
  }
};

const calculateAndPrintSolution = (expression) => {
  let solution = solveExpression(expression);
  printSolution(solution);
};

// tested
const solveExpression = (expression) => {
  const formattedExpression = formatExpression(expression);
  if (!checkSyntaxOnSolve(formattedExpression)) {
    return false;
  }
  let evaluatedExpression = doSolveExpression(formattedExpression);
  return evaluatedExpression;
};

const formatExpression = (expression) => {
  return normalizeSymbols(tokenize(expression));
};

const doSolveExpression = (formattedExpression) => {
  return evaluatePostfixExpression(
    convertFromInfixToPostfix(formattedExpression)
  );
};

// tested
const clearSolution = (
  container = window.document,
  currentState = solutionDisplaying
) => {
  if (currentState === true) clearDisplay(null, container);
  currentState = false;
  return currentState;
};

module.exports = {
  clearDisplay,
  clearSolution,
  clickButton,
  deactivateButton,
  getButtonFromKeyEventCode,
  initButtonClickListeners,
  checkSyntaxOnInput,
  printSolution,
  printToDisplay,
  removeLastCharacter,
  solveExpression,
  switchSign,
};


/***/ }),
/* 2 */
/***/ ((module) => {

// tested
const checkSyntaxOnSolve = (normalizedExpression) => {
  let syntaxCorrect = true;

  if (isLastSymbolAnOperator(normalizedExpression)) {
    syntaxCorrect = false;
  }

  return syntaxCorrect;
};

const isLastSymbolAnOperator = (normalizedExpression) => {
  const lastSymbol = normalizedExpression[normalizedExpression.length - 1];
  return isOperator(lastSymbol);
};

// tested
const tokenize = (expression) => {
  return expression.split(/\s/);
};

// tested
const normalizeSymbols = (tokenizedExpression) => {
  for (let i = 0; i < tokenizedExpression.length; i++) {
    if (tokenizedExpression[i] === "\u00F7") {
      tokenizedExpression[i] = "/";
    } else if (tokenizedExpression[i] === "x") {
      tokenizedExpression[i] = "*";
    }
  }
  return tokenizedExpression;
};

// tested
const convertFromInfixToPostfix = (tokenizedExpression) => {
  const precedence = {
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
  };
  let operatorStack = [];
  let postfixList = [];

  const expression = {
    tokenizedExpression,
    precedence,
    operatorStack,
    postfixList,
  };

  return doConvert(expression);
};

const doConvert = ({
  tokenizedExpression,
  precedence,
  operatorStack,
  postfixList,
}) => {
  for (let i = 0; i < tokenizedExpression.length; i++) {
    token = tokenizedExpression[i];
    if (isCalcNumber(token)) {
      postfixList.push(token);
    } else {
      while (existsOperatorOfLowerPrecedence(operatorStack, precedence)) {
        postfixList.push(operatorStack.pop());
      }

      operatorStack.push(token);
    }
  }
  while (operatorStack.length > 0) {
    postfixList.push(operatorStack.pop());
  }

  return postfixList;
};

const existsOperatorOfLowerPrecedence = (operatorStack, precedence) => {
  const stackLength = operatorStack.length;
  return (
    stackLength > 0 &&
    precedence[operatorStack[stackLength - 1]] >= precedence[token]
  );
};

// tested
const evaluatePostfixExpression = (postfixExpression) => {
  let operandStack = [];
  for (let i = 0; i < postfixExpression.length; i++) {
    let token = postfixExpression[i];

    if (isCalcNumber(token)) {
      operandStack.push(token);
    } else {
      let operandTwo = parseFloat(operandStack.pop());
      let operandOne = parseFloat(operandStack.pop());
      let result = doMath(operandOne, operandTwo, postfixExpression[i]);
      operandStack.push(result);
    }
  }

  return parseFloat(operandStack.pop());
};

// tested
const doMath = (operandOne, operandTwo, operator) => {
  if (operator === "+") return operandOne + operandTwo;
  else if (operator === "-") return operandOne - operandTwo;
  else if (operator === "*") return operandOne * operandTwo;
  else if (operator === "/") return operandOne / operandTwo;
};

// tested
const isCalcNumber = (symbol) => {
  return /^-?\d+\.*\d*$/.test(symbol);
};

const isOperator = (symbol) => {
  return "+-x\u00F7".indexOf(symbol) !== -1;
};

module.exports = {
  checkSyntaxOnSolve,
  tokenize,
  normalizeSymbols,
  convertFromInfixToPostfix,
  evaluatePostfixExpression,
  doMath,
  isCalcNumber,
  isOperator,
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { initButtonClickListeners } = __webpack_require__(1);

initButtonClickListeners();
window.modulesLoaded = true;

})();

/******/ })()
;