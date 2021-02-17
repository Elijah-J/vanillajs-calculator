function initButtonClickListeners() {
  let tokenButtons = document.getElementsByClassName("calculator-token");
  [...tokenButtons].forEach((tokenButton) => {
    tokenButton.onclick = function () {
      printToDisplay(tokenButton.innerText);
    };
  });

  let clearButton = document.getElementById("clear-expression");
  clearButton.onclick = clearDisplay;
}

function printToDisplay(symbol) {
  let display = document.getElementById("display");
  display.innerText += ` ${symbol}`;
}

function clearDisplay() {
  let display = document.getElementById("display");
  display.innerText = "";
}

initButtonClickListeners();
