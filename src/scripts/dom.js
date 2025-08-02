const {
  checkSyntaxOnSolve,
  tokenize,
  normalizeSymbols,
  convertFromInfixToPostfix,
  evaluatePostfixExpression,
  isCalcNumber,
  isOperator,
} = require("./utils.js");

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
  
  // Add ripple to all calculator buttons as a fallback
  const allButtons = document.querySelectorAll('.calculator-button');
  allButtons.forEach(button => {
    if (!button.onclick) {
      button.addEventListener('click', function(e) {
        createRipple(e, button);
      });
    }
  });

  initKeyboardEventListeners();

  document.getElementById("display").innerText = "0";
};

const initTokenButtons = () => {
  let tokenButtons = document.getElementsByClassName("calculator-token");

  [...tokenButtons].forEach((tokenButton) => {
    tokenButton.onclick = function (e) {
      if (!tokenButton._skipRipple) {
        createRipple(e, tokenButton);
      }
      const value = tokenButton.dataset.value || tokenButton.innerText.trim();
      printToDisplay(value);
    };
  });
};

const initClearButton = () => {
  let clearButton = document.getElementById("clear-expression");
  clearButton.onclick = function(e) {
    if (!clearButton._skipRipple) {
      createRipple(e, clearButton);
    }
    clearDisplay();
  };
};

const initBackspaceButton = () => {
  let backspaceButton = document.getElementById("backspace");
  backspaceButton.onclick = function(e) {
    if (!backspaceButton._skipRipple) {
      createRipple(e, backspaceButton);
    }
    removeLastCharacter();
  };
};

const initOppositeButton = () => {
  let oppositeButton = document.getElementById("calculator-opposite");
  oppositeButton.onclick = function(e) {
    if (!oppositeButton._skipRipple) {
      createRipple(e, oppositeButton);
    }
    switchSign();
  };
};

const initSolveButton = () => {
  let solveButton = document.querySelector('[data-action="calculate"]');
  solveButton.onclick = function (e) {
    if (!solveButton._skipRipple) {
      createRipple(e, solveButton);
    }
    calculateAndPrintSolution(document.getElementById("display").innerText);
  };
};

const createRipple = (event, button) => {
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  // Handle keyboard events or missing coordinates by centering the ripple
  let x, y;
  if (event && event.clientX !== undefined && event.clientY !== undefined) {
    x = event.clientX - rect.left - size / 2;
    y = event.clientY - rect.top - size / 2;
  } else {
    // Center the ripple for keyboard events
    x = rect.width / 2 - size / 2;
    y = rect.height / 2 - size / 2;
  }
  
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("ripple");
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 400);
};

const initKeyboardEventListeners = () => {
  document.addEventListener("keydown", clickButton);
  document.addEventListener("keyup", deactivateButton);
};

// tested
const clickButton = (e, container = window.document) => {
  const clickedButton = getButtonFromKeyEventCode(e, container);
  if (clickedButton !== null) {
    clickedButton.classList.add("calculator-button-active");
    
    // Create ripple effect for keyboard events
    createRipple(null, clickedButton);
    
    // Trigger the click without creating another ripple
    clickedButton._skipRipple = true;
    clickedButton.click();
    clickedButton._skipRipple = false;

    return clickedButton;
  }
};

// tested
const deactivateButton = (e, container = window.document) => {
  const clickedButton = getButtonFromKeyEventCode(e, container);
  if (clickedButton !== null) {
    clickedButton.classList.remove("calculator-button-active");

    return clickedButton;
  }
};

// tested
const getButtonFromKeyEventCode = (e, container = window.document) => {
  let keyName = e.key.toString().toLowerCase();

  preventDefaultBehavior(e, keyName);
  let clickedButton = doGetButton(keyName, container);

  return clickedButton;
};

const preventDefaultBehavior = (e, keyName) => {
  if (keyName === "enter" || keyName === " " || keyName === "backspace" || keyName === "delete") {
    e.preventDefault();
  }
};

const doGetButton = (keyName, container = window.document) => {
  let clickedButton = null;
  if (keyName === "enter") {
    clickedButton = container.querySelector('[data-action="calculate"]');
  } else if (keyName === "escape") {
    clickedButton = container.getElementById("clear-expression");
  } else if (keyName === "o") {
    clickedButton = container.getElementById("calculator-opposite");
  } else if (keyName === "backspace" || keyName === "delete") {
    clickedButton = container.getElementById("backspace");
  } else if (/^[0-9]$/.test(keyName)) {
    clickedButton = container.querySelector(`[data-value="${keyName}"][data-action="number"]`);
  } else if (keyName === "." || keyName === ",") {
    clickedButton = container.querySelector('[data-value="."]');
  } else if (keyName === "+" || keyName === "-" || keyName === "*" || keyName === "/") {
    clickedButton = container.querySelector(`[data-value="${keyName}"][data-action="operator"]`);
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
  // Clear the initial "0" if needed
  if (display.innerText === "0" && /\d/.test(symbol)) {
    display.innerText = "";
  }
  
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
  container.getElementById("display").innerText = "0";
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
