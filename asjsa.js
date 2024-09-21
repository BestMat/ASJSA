// ©2021 - Asynchronous Server JavaScript API's - BestMat 

var document = window.document;
var version = 1;
() => {
    'use strict';
}
const element = (a) => {
    return document.querySelector(a)
};
const onClick = (a,b) => {
    element(a).onclick = function(){
        (b)()
    };
};
const copy = (a) => {
    const b = element(a);
    b.select();element(a).setSelectionRange(0, 99999);
    document.execCommand("copy");
};
const val = (a) => {
    return element(a).value
};
const capsLockActivated = (e) => {
    var x = e.getModifierState("CapsLock");
    return x;
};
const isChecked = function(a){
    if(element(a).checked){
        return true;
    }
};
const isUndefined = (a) => {
    if(typeof a === 'undefined'){
        return true;}
    };
const type = (a) => {
    return typeof a
};
const exec = (a) => {
    a;
};
const print = (a) => {
    console.log(a)
};
var isWindow = function isWindow( obj ) {
    return obj != null && obj === obj.window;
};
var preservedScriptAttributes = {
    type: true,
    src: true,
    nonce: true,
    noModule: true
};
function DOMEval( code, node, doc ) {
    doc = doc || document;
    var i, val,
        script = doc.createElement( "script" );
    script.text = code;
    if (node) {
        for (i in preservedScriptAttributes) {
            val = node[i] || node.getAttribute && node.getAttribute(i);
            if (val) {
                script.setAttribute(i,val);
            }
        }
    }
    doc.head.appendChild(script).parentNode.removeChild( script );
}
class asjsaMethods{
 constructor(){}
 even(a){
    if (a % 2 == 0) {
        return true;
    }else{
        return false;
    }
 }
 odd(a){
    if (a % 2 == 0) {
        return false;
    }else{
        return true;
    }
 }
 each(a){
    (a).forEach(b);
    function b(item) {
      return item;
    }
 }
 char_at(a,b){
 return (a).charAt(b)
 }
 getLocation() {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition();
    } else { 
      return "Geolocation is not supported by this browser.";
    }
  }
}
class asjsaCss{
    constructor(){}
    getCSS(a){
        var e = element(a)[0];
        return e.style.cssText;
    }
    setCSS(a,b){
        (a).style.cssText = b;
    }
}
class asjsaEvents{
    constructor(){}
    coords(event) {
        var x = event.clientX;
        var y = event.clientY;
        var o = {
            "xPos": x,
            "yPos": y
        };
        return o;
      }
      key(event){
          return event.code;
      }

}
function prevent_default(e){
    e.preventDefault()
}
function infinity(){
    return 1.7976931348623157E+10308
}
function num(a){return Number(a)}
function bool(a){return Boolean(a)}
function str(a){return String(a)}
