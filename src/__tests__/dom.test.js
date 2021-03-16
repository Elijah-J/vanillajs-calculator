const { getButtonFromKeyEventCode } = require("../scripts/dom.js");
const { test, expect } = require("@jest/globals");
const { createEvent, getByText, fireEvent } = require("@testing-library/dom");
const { JSDOM } = require("jsdom");
const path = require("path");
require("iconv-lite").encodingExists("foo"); // workaround to allow utf-8 support

const pathToHtml = path.resolve(__dirname, "../../dist/index.html");
const options = {
  runScripts: "dangerously",
  resources: "usable",
};
let dom, container;

const sleep = (ms = 100) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const pollModules = async () => {
  while (dom.window.modulesLoaded !== true) {
    await sleep();
  }
  return;
};

describe("dom.js", () => {
  beforeEach(async () => {
    dom = await JSDOM.fromFile(pathToHtml, options);
    await pollModules();
    container = dom.window.document;
  });

  it("confirms calculator is rendered", () => {
    expect(container.body.querySelector(".calculator")).not.toBeNull();
  });

  it("confirms 19 calculator buttons are rendered", () => {
    expect(container.body.querySelectorAll("button").length).toBe(19);
  });

  // getButtonFromKeyCode
  it("confirms key code is extracted correctly", async () => {
    const event = createEvent.keyDown(container, { key: "1", code: "Digit1" });
    const buttonOne = getByText(container, "1");

    expect(getButtonFromKeyEventCode(event, container)).toEqual(buttonOne);
  });
});
