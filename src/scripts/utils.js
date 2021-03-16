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
