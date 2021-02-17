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
  if (/^\d+$/.test(symbol)) {
    display.innerText += `${symbol}`;
  } else {
    display.innerText += `\xa0${symbol}\xa0`;
  }
  console.log(display.innerText);
}

function clearDisplay() {
  let display = document.getElementById("display");
  display.innerText = "";
}

initButtonClickListeners();
