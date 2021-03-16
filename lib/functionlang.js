let e = []
let ex = "js"
let domtype = true
let jqimported = false
print("Running with FunctionLang")
function ifLoop(c,n){
    if(c){
     (n)()
    }
}
function whileLoop(c,n){
    while(c){
     (n)()
    }
}
function enable(a){
 if(a === "typescript" && ex==="js"){
   printErr("File extension is JavaScript.")
 }else if(a === "typescript" && ex==="ts"){
   e.push("typescript")
 }else if(a === "jquery" && domtye == true){
   importPackage("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js")
   jqimported = true
 }else if(a === "ajax" && domtye == true){
    importPackage("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js")
    jqimported = true
  }
}
function print(x){
    console.log(x)
}
function printErr(x){
    console.error(x)
}
function call(a){
    (a)()
}
function setValue(a,b){
    (a) = b
}
function type(a){
    return typeof a
}
function importPackage(pack){
    let pkg = document.createElement("script");
    pkg.setAttribute("src", pack);
    document.body.appendChild(pkg);
  }
function restGet(u){
    if(jqimported){
    $.get(url, function(res){
        return res
    })
}else{
    printErr("AJAX/jQuery not imported. To import use enable('jquery') or enable('ajax')")
}
}
function arrayOf(a,o){
    return (a)[0]
}
function strToNum(a){
    return parseInt(a)
}
function strToFloat(a){
    return parseFloat(a)
}
function toStr(a){
    return a.toString()
}
function arrayJoin(a,b){
    (a).join(b)
}
function arrayAppend(a,b){
    (a).push(b)
}
function arrayPop(a){
    (a).pop()
}
function arrayShift(a){
    (a).shift()
}
function arrayDel(a,b){
    delete (a)[b]
}
function arrayInsertBetween(a,b,c){
    (a).splice(b,c)
}
function arrayMerge(a,b){
    a.concat(b)
}
function arraySort(a){
    return a.sort()
}
function arrayReverse(a){
    return a.reverse()
}
