// ©202 - Asynchronous Server JavaScript API's - BestMat 
// No Copying Code
() => {'use strict';}
const element = (a) => {return document.querySelector(a)};const onClick = (a,b) => {element(a).onclick = function() {(b)()};};const copy = (a) => {const b = element(a);b.select();element(a).setSelectionRange(0, 99999);document.execCommand("copy");}
