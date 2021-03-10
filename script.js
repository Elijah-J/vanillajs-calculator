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

  let solveButton = document.getElementById("solve-expression");
  solveButton.onclick = function () {
    solveExpression(document.getElementById("display").innerText);
  };
}

function printToDisplay(symbol) {
  let display = document.getElementById("display");
  if (/^\d+$/.test(symbol)) {
    display.innerText += `${symbol}`;
  } else if (/^\.$/.test(symbol)) {
    console.log(".");
    if (!/^\d+$/.test(display.innerText[display.innerText.length - 1]))
      return null;
    display.innerText += `${symbol}`;
  } else {
    display.innerText += `\xa0${symbol}\xa0 `;
  }
}

function clearDisplay() {
  let display = document.getElementById("display");
  display.innerText = "";
}

function removeLastCharacter() {
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
  } while (/\s/.test(display.innerText[display.innerText.length - 1]));
}

function printResult(result) {
  let display = document.getElementById("display");
  display.innerText = result;
}

function solveExpression(expression) {
  let tokenizedExpression = tokenize(expression);
  let normalizedExpression = normalizeSymbols(tokenizedExpression);
  let postfixExpression = convertFromInfixToPostfix(normalizedExpression);
  let evaluatedExpression = evaluatePostfixExpression(postfixExpression);

  printResult(evaluatedExpression);
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

initButtonClickListeners();
