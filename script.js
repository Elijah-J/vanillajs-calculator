const MAX_DISPLAY_CAPCITY = 17;
const MAX_DIGITS_WITH_DECIMAL = MAX_DISPLAY_CAPCITY - 1; // to account for negative sign
const MAX_POSSIBLE_INTEGER = Math.pow(10, MAX_DIGITS_WITH_DECIMAL) - 1;
const MAX_DECIMAL_PRECISION = 16;

let solutionDisplaying = false;

function clickButton(e) {
  let clickedButton = extractKeyName(e);
  if (clickedButton === null) return;

  clickedButton.classList.toggle("calculator-button-active");
  clickedButton.click();
}

function deactivateButton(e) {
  let clickedButton = extractKeyName(e);
  if (clickedButton === null) return;

  clickedButton.classList.remove("calculator-button-active");
}

function extractKeyName(e) {
  let keyName = e.key.toString().toLowerCase();
  if (keyName === "enter" || keyName == "space") {
    e.preventDefault();
  }
  let clickedButton = null;
  if (keyName === "enter") {
    clickedButton = document.getElementById("=");
  } else if (keyName === "escape") {
    clickedButton = document.getElementById("clear-expression");
  } else if (keyName === "o") {
    clickedButton = document.getElementById("calculator-opposite");
  } else {
    clickedButton = document.getElementById(keyName);
  }
  return clickedButton;
}

function initButtonClickListeners() {
  let tokenButtons = document.getElementsByClassName("calculator-token");
  [...tokenButtons].forEach((tokenButton) => {
    tokenButton.onclick = function (e) {
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
}

function printToDisplay(symbol) {
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
}

function checkSyntaxOnInput(symbol) {
  const displayText = document.getElementById("display").innerText;
  let tokenizedDisplayText = tokenize(displayText);
  let normalizedDisplayText = normalizeSymbols(tokenizedDisplayText);

  if ("+-x\u00F7".indexOf(symbol) !== -1) {
    if (!isNumber(normalizedDisplayText[normalizedDisplayText.length - 1])) {
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
}

function clearDisplay() {
  let display = document.getElementById("display");
  display.innerText = "";
}

function removeLastCharacter() {
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
}

function printSolution(solution) {
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
}

function switchSign() {
  if (solutionDisplaying) solutionDisplaying = false;

  let displayText = document.getElementById("display").innerText;
  let tokenizedDisplay = tokenize(displayText);
  let currentSymbol = tokenizedDisplay[tokenizedDisplay.length - 1];
  if (isNumber(currentSymbol)) {
    if (currentSymbol.charAt(0) === "-") {
      currentSymbol = currentSymbol.slice(1, currentSymbol.length);
    } else {
      currentSymbol = "-" + currentSymbol;
    }
    tokenizedDisplay[tokenizedDisplay.length - 1] = currentSymbol;
    document.getElementById("display").innerText = tokenizedDisplay.join(" ");
  }
}

function solveExpression(expression) {
  let tokenizedExpression = tokenize(expression);
  let normalizedExpression = normalizeSymbols(tokenizedExpression);
  if (!checkSyntaxOnSolve(normalizedExpression)) {
    return false;
  }
  let postfixExpression = convertFromInfixToPostfix(normalizedExpression);
  let evaluatedExpression = evaluatePostfixExpression(postfixExpression);

  printSolution(evaluatedExpression);
}

function checkSyntaxOnSolve(normalizedExpression) {
  if (
    "+-*/".indexOf(normalizedExpression[normalizedExpression.length - 1]) !== -1
  ) {
    return false;
  }

  return true;
}

function tokenize(expression) {
  return expression.split(/\s/);
}

function normalizeSymbols(tokenizedExpression) {
  for (let i = 0; i < tokenizedExpression.length; i++) {
    if (tokenizedExpression[i] === "\u00F7") {
      tokenizedExpression[i] = "/";
    } else if (tokenizedExpression[i] === "x") {
      tokenizedExpression[i] = "*";
    }
  }
  return tokenizedExpression;
}

function convertFromInfixToPostfix(tokenizedExpression) {
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
}

function evaluatePostfixExpression(postfixExpression) {
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
}

function doMath(operandOne, operandTwo, operator) {
  if (operator === "+") return operandOne + operandTwo;
  else if (operator === "-") return operandOne - operandTwo;
  else if (operator === "*") return operandOne * operandTwo;
  else if (operator === "/") return operandOne / operandTwo;
}

function isNumber(symbol) {
  return /^-?\d+\.*\d*$/.test(symbol);
}

function clearSolution() {
  if (solutionDisplaying === true) clearDisplay();
  solutionDisplaying = false;
}

initButtonClickListeners();
