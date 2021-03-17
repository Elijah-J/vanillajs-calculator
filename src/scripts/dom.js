const {
  checkSyntaxOnSolve,
  tokenize,
  normalizeSymbols,
  convertFromInfixToPostfix,
  evaluatePostfixExpression,
  isCalcNumber,
} = require("./utils.js");

const MAX_DISPLAY_CAPCITY = 17;
const MAX_DIGITS_WITH_DECIMAL = MAX_DISPLAY_CAPCITY - 1; // to account for negative sign
const MAX_DECIMAL_PRECISION = 16;

let solutionDisplaying = false;

// tested
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
    calculateAndPrintSolution(document.getElementById("display").innerText);
  };

  document.addEventListener("keydown", clickButton);
  document.addEventListener("keyup", deactivateButton);

  document.getElementById("display").innerText = "";
};

// tested
const clickButton = (e, container = window.document) => {
  let clickedButton = getButtonFromKeyEventCode(e, container);
  if (clickedButton === null) return;

  clickedButton.classList.toggle("calculator-button-active");
  clickedButton.click();

  return clickedButton;
};

// tested
const deactivateButton = (e, container = window.document) => {
  let clickedButton = getButtonFromKeyEventCode(e, container);
  if (clickedButton === null) return;

  clickedButton.classList.remove("calculator-button-active");

  return clickedButton;
};

// tested
const getButtonFromKeyEventCode = (e, container = window.document) => {
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

// tested
const printToDisplay = (symbol, container = window.document) => {
  if ("+-x\u00F7".indexOf(symbol) === -1) {
    solutionDisplaying = clearSolution(container);
  }

  solutionDisplaying = false;

  let display = container.getElementById("display");
  if (
    display.innerText.length >= MAX_DISPLAY_CAPCITY ||
    !checkSyntaxOnInput(symbol, container)
  )
    return;

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
    solution = "Error: Overflow";
  }

  display.innerText = solution + "";
  solutionDisplaying = true;
};

// tested
const switchSign = (e, container = window.document) => {
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
  let tokenizedExpression = tokenize(expression);
  let normalizedExpression = normalizeSymbols(tokenizedExpression);
  if (!checkSyntaxOnSolve(normalizedExpression)) {
    return false;
  }
  let postfixExpression = convertFromInfixToPostfix(normalizedExpression);
  let evaluatedExpression = evaluatePostfixExpression(postfixExpression);
  return parseFloat(evaluatedExpression);
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
