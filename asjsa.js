// ©2021 - Asynchronous Server JavaScript API's - BestMat 
// No Copying Code
// Author: Yuvanth B
() => {'use strict';}
const element = (a) => {return document.querySelector(a)};
const onClick = (a,b) => {element(a).onclick = function() {(b)()};};
const copy = (a) => {const b = element(a);b.select();element(a).setSelectionRange(0, 99999);document.execCommand("copy");};
const val = (a) => {return element(a).value};const isAlt = (a) => {return false};const capsLockActivated = (e) => { var x = e.getModifierState("CapsLock");return x;};
const isChecked = function(a){if(element(a).checked){return true;}};const isUndefined = (a) => {if(typeof a === 'undefined'){return true;}};const type = (a) => {return typeof a};const exec = (a) => {a;};const print = (a) => {console.log(a)}
