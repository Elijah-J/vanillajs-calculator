function initButtonClickListeners() {
  let tokenButtons = document.getElementsByClassName("calculator-token");
  [...tokenButtons].forEach((tokenButton) => {
    tokenButton.onclick = function () {
      printToDisplay(tokenButton.innerText);
    };
  });

  let clearButton = document.getElementById("clear-expression");
  clearButton.onclick = clearDisplay;

  let solveButton = document.getElementById("solve-expression");
  solveButton.onclick = function () {
    solveExpression(document.getElementById("display").innerText);
  };
}

function printToDisplay(symbol) {
  let display = document.getElementById("display");
  if (/^\d+$/.test(symbol)) {
    display.innerText += `${symbol}`;
  } else {
    display.innerText += `\xa0${symbol}\xa0 `;
  }
}

function clearDisplay() {
  let display = document.getElementById("display");
  display.innerText = "";
}

function printResult(result) {
  let display = document.getElementById("display");
  display.innerText = result;
}

function solveExpression(expression) {
  let tokenizedExpression = tokenize(expression);
  let postfixExpression = convertFromInfixToPostfix(tokenizedExpression);
  let evaluatedExpression = evaluatePostfixExpression(postfixExpression);

  printResult(evaluatedExpression);
}

function tokenize(expression) {
  return expression.split(/\s/);
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
      let operandTwo = parseInt(operandStack.pop());
      let operandOne = parseInt(operandStack.pop());
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
