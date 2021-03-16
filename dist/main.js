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
} = __webpack_require__(2);

const MAX_DISPLAY_CAPCITY = 17;
const MAX_DIGITS_WITH_DECIMAL = MAX_DISPLAY_CAPCITY - 1; // to account for negative sign
const MAX_POSSIBLE_INTEGER = Math.pow(10, MAX_DIGITS_WITH_DECIMAL) - 1;
const MAX_DECIMAL_PRECISION = 16;

let solutionDisplaying = false;

const initButtonClickListeners = () => {
  let tokenButtons = document.getElementsByClassName("calculator-token");

  [...tokenButtons].forEach((tokenButton) => {
    tokenButton.onclick = function () {
      printToDisplay(tokenButton.innerText);
    };
  });

  let clearButton = document.getElementById("clear-expression");
  clearButton.onclick = clearDisplay;

  let backspaceButton = document.getElementById("backspace");
  backspaceButton.onclick = removeLastCharacter;

  let oppositeButton = document.getElementById("calculator-opposite");
  oppositeButton.onclick = switchSign;

  let solveButton = document.getElementById("=");
  solveButton.onclick = function () {
    solveExpression(document.getElementById("display").innerText);
  };

  document.addEventListener("keydown", clickButton);
  document.addEventListener("keyup", deactivateButton);

  document
    .getElementsByClassName("calculator")[0]
    .appendChild(document.createElement("button"));
};

const clickButton = (e) => {
  let clickedButton = getButtonFromKeyEventCode(e);
  if (clickedButton === null) return;

  clickedButton.classList.toggle("calculator-button-active");
  clickedButton.click();
};

const deactivateButton = (e) => {
  let clickedButton = getButtonFromKeyEventCode(e);
  if (clickedButton === null) return;

  clickedButton.classList.remove("calculator-button-active");
};

const getButtonFromKeyEventCode = (e, container = document) => {
  let keyName = e.key.toString().toLowerCase();
  if (keyName === "enter" || keyName == "space") {
    e.preventDefault();
  }

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

const printToDisplay = (symbol) => {
  if ("+-x\u00F7".indexOf(symbol) === -1) {
    clearSolution();
  }

  if (solutionDisplaying) solutionDisplaying = false;

  let display = document.getElementById("display");
  if (
    display.innerText.length >= MAX_DISPLAY_CAPCITY ||
    !checkSyntaxOnInput(symbol)
  )
    return;

  if (/\d/.test(symbol)) {
    display.innerText += `${symbol}`;
  } else if (/^\.$/.test(symbol)) {
    if (!/^\d+$/.test(display.innerText[display.innerText.length - 1]))
      return null;
    display.innerText += `${symbol}`;
  } else {
    display.innerText += `\xa0${symbol}\xa0 `;
  }
};

const checkSyntaxOnInput = (symbol) => {
  const displayText = document.getElementById("display").innerText;
  let tokenizedDisplayText = tokenize(displayText);
  let normalizedDisplayText = normalizeSymbols(tokenizedDisplayText);

  if ("+-x\u00F7".indexOf(symbol) !== -1) {
    if (
      !isCalcNumber(normalizedDisplayText[normalizedDisplayText.length - 1])
    ) {
      return false;
    }
  } else if (/^\.$/.test(symbol)) {
    if (
      normalizedDisplayText[normalizedDisplayText.length - 1].indexOf(".") != -1
    ) {
      return false;
    }
  }
  return true;
};

const clearDisplay = () => {
  let display = document.getElementById("display");
  display.innerText = "";
};

const removeLastCharacter = () => {
  if (solutionDisplaying) solutionDisplaying = false;

  let display = document.getElementById("display");
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

const printSolution = (solution) => {
  let display = document.getElementById("display");
  let stringSolution = solution.toString();

  if (stringSolution.includes(".")) {
    let symbolsBeforeMantissa = solution.toString().split(".")[0].length + 1;
    let mantissaLength = solution.toString().split(".")[1].length;

    if (stringSolution.length > MAX_DIGITS_WITH_DECIMAL) {
      solution = solution.toFixed(
        MAX_DIGITS_WITH_DECIMAL - symbolsBeforeMantissa
      );
    } else if (mantissaLength < MAX_DECIMAL_PRECISION) {
      solution = solution.toFixed(mantissaLength);
    } else {
      solution = solution.toFixed(MAX_DECIMAL_PRECISION);
    }
  } else if (solution > MAX_POSSIBLE_INTEGER) {
    solution = Math.round((solution / 10) * 10);
  }

  display.innerText = solution;
  solutionDisplaying = true;
};

const switchSign = () => {
  if (solutionDisplaying) solutionDisplaying = false;

  let displayText = document.getElementById("display").innerText;
  let tokenizedDisplay = tokenize(displayText);
  let currentSymbol = tokenizedDisplay[tokenizedDisplay.length - 1];
  if (isCalcNumber(currentSymbol)) {
    if (currentSymbol.charAt(0) === "-") {
      currentSymbol = currentSymbol.slice(1, currentSymbol.length);
    } else {
      currentSymbol = "-" + currentSymbol;
    }
    tokenizedDisplay[tokenizedDisplay.length - 1] = currentSymbol;
    document.getElementById("display").innerText = tokenizedDisplay.join(" ");
  }
};

const solveExpression = (expression) => {
  let tokenizedExpression = tokenize(expression);
  let normalizedExpression = normalizeSymbols(tokenizedExpression);
  if (!checkSyntaxOnSolve(normalizedExpression)) {
    return false;
  }
  let postfixExpression = convertFromInfixToPostfix(normalizedExpression);
  let evaluatedExpression = evaluatePostfixExpression(postfixExpression);

  printSolution(evaluatedExpression);
};

const clearSolution = () => {
  if (solutionDisplaying === true) clearDisplay();
  solutionDisplaying = false;
};

module.exports = { initButtonClickListeners, getButtonFromKeyEventCode };


/***/ }),
/* 2 */
/***/ ((module) => {

// tested
const checkSyntaxOnSolve = (normalizedExpression) => {
  if (
    "+-*/".indexOf(normalizedExpression[normalizedExpression.length - 1]) !== -1
  ) {
    return false;
  }

  return true;
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

  for (let i = 0; i < tokenizedExpression.length; i++) {
    token = tokenizedExpression[i];
    if (token.match(/\d/)) {
      postfixList.push(token);
    } else {
      while (
        operatorStack.length > 0 &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
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

// tested
const evaluatePostfixExpression = (postfixExpression) => {
  let operandStack = [];
  for (let i = 0; i < postfixExpression.length; i++) {
    let token = postfixExpression[i];

    if (token.match(/\d/)) {
      operandStack.push(token);
    } else {
      let operandTwo = parseFloat(operandStack.pop());
      let operandOne = parseFloat(operandStack.pop());
      let result = doMath(operandOne, operandTwo, postfixExpression[i]);
      operandStack.push(result);
    }
  }

  return operandStack.pop();
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

module.exports = {
  checkSyntaxOnSolve,
  tokenize,
  normalizeSymbols,
  convertFromInfixToPostfix,
  evaluatePostfixExpression,
  doMath,
  isCalcNumber,
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