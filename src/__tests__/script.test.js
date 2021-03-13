const { test, expect } = require("@jest/globals");
const {
  isCalcNumber,
  doMath,
  convertFromInfixToPostfix,
  evaluatePostfixExpression,
  tokenize,
  normalizeSymbols,
  checkSyntaxOnSolve,
} = require("../script");

const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

let dom;
let container;

describe("index.html", () => {
  beforeEach(() => {
    dom = new jsdom.JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
  });

  // isCalcNumber
  test("confirms that 1 is a number", () => {
    expect(isCalcNumber("1")).toBe(true);
  });

  test("confirms that 1.2 is a number", () => {
    expect(isCalcNumber("1.2")).toBe(true);
  });

  test("confirms that -1 is a number", () => {
    expect(isCalcNumber("-1")).toBe(true);
  });

  test("confirms that -12.34 is a number", () => {
    expect(isCalcNumber("-12.34")).toBe(true);
  });

  test("confirms that -. is not a number", () => {
    expect(isCalcNumber("-.")).toBe(false);
  });

  // doMath
  test("confirms that addition works", () => {
    expect(doMath(1, 2, "+")).toBe(3);
  });

  test("confirms that subtraction works", () => {
    expect(doMath(1, 2, "-")).toBe(-1);
  });

  test("confirms that multiplication works", () => {
    expect(doMath(1, 2, "*")).toBe(2);
  });

  test("confirms that division works", () => {
    expect(doMath(8, 2, "/")).toBe(4);
  });

  // convertFromInfixToPostfix
  test("confirms infix expression with all four operators is converted correctly", () => {
    expect(
      convertFromInfixToPostfix(["2", "+", "4", "-", "6", "*", "8", "/", "16"])
    ).toEqual(["2", "4", "+", "6", "8", "*", "16", "/", "-"]);
  });

  // evaluatePostfixExpression
  test("confirms postfix expression with all four operators is evaluated correctly", () => {
    expect(
      evaluatePostfixExpression(["2", "4", "+", "6", "8", "*", "16", "/", "-"])
    ).toBe(3);
  });

  // tokenize
  test("confirms expressions are tokenized correctly", () => {
    expect(tokenize("5 + 7 - 9 * 6")).toEqual([
      "5",
      "+",
      "7",
      "-",
      "9",
      "*",
      "6",
    ]);
  });

  // normalizeSymbols
  test("confirm symbols are normalized correctly", () => {
    expect(normalizeSymbols(["\u00F7", "x"])).toEqual(["/", "*"]);
  });

  // checkSyntaxOnSolve
  test("confirms infix syntax without operator at end is valid", () => {
    expect(checkSyntaxOnSolve(["5", "/", "9"])).toBe(true);
  });

  test("confirms infix syntax with operator at end is invalid", () => {
    expect(checkSyntaxOnSolve(["5", "7", "-"])).toBe(false);
  });
});
