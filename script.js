function initButtonClickListeners() {
  let buttons = document.getElementsByTagName("button");
  [...buttons].forEach((button) => {
    button.onclick = function () {
      printToDisplay(button.innerText);
    };
  });
}

function printToDisplay(symbol) {
  let display = document.getElementById("display");
  display.innerText += ` ${symbol}`;
}

initButtonClickListeners();
