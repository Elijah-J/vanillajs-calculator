(()=>{var e={390:(e,t,n)=>{const{checkSyntaxOnSolve:o,tokenize:l,normalizeSymbols:i,convertFromInfixToPostfix:r,evaluatePostfixExpression:s,isCalcNumber:c,isOperator:d}=n(389);let u=!1,a=!1;const p=(e,t=window.document)=>{const n=m(e,t);if(null!==p)return n.classList.toggle("calculator-button-active"),n.click(),n},x=(e,t=window.document)=>{const n=m(e,t);if(null!==p)return n.classList.remove("calculator-button-active"),n},m=(e,t=window.document)=>{let n=e.key.toString().toLowerCase();return g(e,n),clickedButton=y(n,t),clickedButton},g=(e,t)=>{"enter"!==t&&"space"!=t||e.preventDefault()},y=(e,t=window.document)=>{let n=null;return n="enter"===e?t.getElementById("="):"escape"===e?t.getElementById("clear-expression"):"o"===e?t.getElementById("calculator-opposite"):t.getElementById(e),n},h=(e,t=window.document)=>{!0===a&&null!=a&&(w(null,t),a=!1),d(e)||(u=L(t)),u=!1;let n=t.getElementById("display");n.innerText.length>=17||!k(e,t)||f(e,n)},f=(e,t)=>{/\d/.test(e)||/^\.$/.test(e)?t.innerText+=`${e}`:t.innerText+=` ${e} `},k=(e,t=window.document)=>{const n=t.getElementById("display");let o=l(n.innerText),r=i(o);if(-1!=="+-x÷".indexOf(e)){if(!c(r[r.length-1]))return!1}else if(/^\.$/.test(e)&&(-1!=r[r.length-1].indexOf(".")||!/^\d+$/.test(n.innerText[n.innerText.length-1])))return!1;return!0},w=(e,t=window.document)=>{t.getElementById("display").innerText=""},E=(e,t=window.document)=>{!0===a&&null!=a&&(w(null,t),a=!1),u=!1;let n=t.getElementById("display"),o=1;/\s/.test(n.innerText[n.innerText.length-1])&&(o=2);do{n.innerText=n.innerText.slice(0,n.innerText.length-o),o=1}while(/(\s|-|\.)/.test(n.innerText[n.innerText.length-1]));-1!=="+-x÷".indexOf(n.innerText[n.innerText.length-1])&&(document.getElementById("display").innerText+=" ")},B=(e,t=window.document)=>{let n=t.getElementById("display"),o=e.toString();if(o.includes(".")){let t=e.toString().split(".")[0].length+1,n=e.toString().split(".")[1].length;e=o.length>16?parseFloat(e.toFixed(16-t)):n<16?parseFloat(e.toFixed(n)):parseFloat(e.toFixed(16))}else o.length>16?(e="Overflow",a=!0):Number.isFinite(e)||(e="Divide by Zero",a=!0);n.innerText=e+"",!1===a&&(u=!0)},T=(e,t=window.document,n=a)=>{if(!0===n&&null!=n)return w(null,t),void(a=!1);u=!1;let o=l(t.getElementById("display").innerText),i=o[o.length-1];c(i)&&(i="-"===i.charAt(0)?i.slice(1,i.length):"-"+i,o[o.length-1]=i,t.getElementById("display").innerText=o.join(" "))},v=e=>{let t=I(e);B(t)},I=e=>{const t=S(e);return!!o(t)&&F(t)},S=e=>i(l(e)),F=e=>s(r(e)),L=(e=window.document,t=u)=>(!0===t&&w(null,e),!1);e.exports={clearDisplay:w,clearSolution:L,clickButton:p,deactivateButton:x,getButtonFromKeyEventCode:m,initButtonClickListeners:()=>{[...document.getElementsByClassName("calculator-token")].forEach((e=>{e.onclick=function(){h(e.innerText)}})),document.getElementById("clear-expression").onclick=w,document.getElementById("backspace").onclick=E,document.getElementById("calculator-opposite").onclick=T,document.getElementById("=").onclick=function(){v(document.getElementById("display").innerText)},document.addEventListener("keydown",p),document.addEventListener("keyup",x),document.getElementById("display").innerText=""},checkSyntaxOnInput:k,printSolution:B,printToDisplay:h,removeLastCharacter:E,solveExpression:I,switchSign:T}},389:e=>{const t=(e,t)=>{const n=e.length;return n>0&&t[e[n-1]]>=t[token]},n=(e,t,n)=>"+"===n?e+t:"-"===n?e-t:"*"===n?e*t:"/"===n?e/t:void 0,o=e=>/^-?\d+\.*\d*$/.test(e),l=e=>-1!=="+-x÷".indexOf(e);e.exports={checkSyntaxOnSolve:e=>{let t=!0;return(e=>{const t=e[e.length-1];return l(t)})(e)&&(t=!1),t},tokenize:e=>e.split(/\s/),normalizeSymbols:e=>{for(let t=0;t<e.length;t++)"÷"===e[t]?e[t]="/":"x"===e[t]&&(e[t]="*");return e},convertFromInfixToPostfix:e=>(({tokenizedExpression:e,precedence:n,operatorStack:l,postfixList:i})=>{for(let r=0;r<e.length;r++)if(token=e[r],o(token))i.push(token);else{for(;t(l,n);)i.push(l.pop());l.push(token)}for(;l.length>0;)i.push(l.pop());return i})({tokenizedExpression:e,precedence:{"*":2,"/":2,"+":1,"-":1},operatorStack:[],postfixList:[]}),evaluatePostfixExpression:e=>{let t=[];for(let l=0;l<e.length;l++){let i=e[l];if(o(i))t.push(i);else{let o=parseFloat(t.pop()),i=parseFloat(t.pop()),r=n(i,o,e[l]);t.push(r)}}return parseFloat(t.pop())},doMath:n,isCalcNumber:o,isOperator:l}}},t={};function n(o){var l=t[o];if(void 0!==l)return l.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,n),i.exports}(()=>{const{initButtonClickListeners:e}=n(390);e(),window.modulesLoaded=!0})()})();