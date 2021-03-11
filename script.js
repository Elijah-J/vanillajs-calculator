const MAX_DISPLAY_CAPCITY = 20;
let solutionDisplaying = false;

function initButtonClickListeners() {
  let tokenButtons = document.getElementsByClassName("calculator-token");
  [...tokenButtons].forEach((tokenButton) => {
    tokenButton.onclick = function () {
      printToDisplay(tokenButton.innerText);
    };
  });

  let clearButton = document.getElementById("clear-expression");
  clearButton.onclick = clearDisplay;

  let backspaceButton = document.getElementById("calculator-backspace");
  backspaceButton.onclick = removeLastCharacter;

  let oppositeButton = document.getElementById("calculator-opposite");
  oppositeButton.onclick = switchSign;

  let solveButton = document.getElementById("solve-expression");
  solveButton.onclick = function () {
    solveExpression(document.getElementById("display").innerText);
  };
}

function printToDisplay(symbol) {
  clearSolution();

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
  clearSolution();

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
    console.log("call");
    document.getElementById("display").innerText += "\xa0";
  }
}

function printResult(result) {
  let display = document.getElementById("display");
  display.innerText = result;
  solutionDisplaying = true;
}

function switchSign() {
  if (solutionDisplaying === true) clearDisplay();

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

  printResult(evaluatedExpression);
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
