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
