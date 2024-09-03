let drawOptions = document.querySelector(".draw-options").children;
let shapeOptions = document.querySelector(".shapeoptions").children;
let tabOptions = document.querySelectorAll(".nav ul li");
let sideMenu = document.querySelector(".sidemenu").children;
let sideMenuArr = Array.from(sideMenu);

let savedfiles = document.querySelector(".savedfiles")

let ham = document.querySelector(".hamburger");

let inputR = document.querySelector(".thickness > input");
let inputV = document.querySelector(".sizeinput > input");

let color = document.querySelector(".color input");
let opacity = document.querySelector(".opacity input");

let selectedTab = "draw"
let seletedTabHTML = tabOptions[0];
seletedTabHTML.classList.add("liactive")
tabChange()
let selectedOption = null;
let selectedOptionHTML = null;
let lineW = 2;
let selectedColor = "black"
let selectedOpacity = "ff"
let opVal = 255

tabOptions.forEach(e => {
    e.addEventListener("click", () => {
        if(seletedTabHTML != e){
            seletedTabHTML.classList.remove("liactive")
            e.classList.add("liactive")
            seletedTabHTML = e
            selectedTab = e.dataset.tab
            tabChange()
        }
    })
})

let drawOptionsArr = Array.from(drawOptions);
drawOptionsArr.forEach(e => {
    e.addEventListener("click",() => {
        if(selectedOption == null){
            e.classList.add("active");
            selectedOption = e.dataset.option;
            selectedOptionHTML = e
        }else{
            if(selectedOption == e.dataset.option){
                e.classList.remove("active");
                selectedOption = null
                selectedOptionHTML = null
            }else{
                selectedOptionHTML.classList.remove("active")
                selectedOption = e.dataset.option
                e.classList.add("active")
                selectedOptionHTML = e
            }
        }
    })
});

let shapeOptionsArr = Array.from(shapeOptions);
shapeOptionsArr.forEach(e => {
    e.addEventListener("click",() => {
        if(selectedOption == null){
            e.classList.add("active");
            selectedOption = e.dataset.option;
            selectedOptionHTML = e
        }else{
            if(selectedOption == e.dataset.option){
                e.classList.remove("active");
                selectedOption = null
                selectedOptionHTML = null
            }else{
                selectedOptionHTML.classList.remove("active")
                selectedOption = e.dataset.option
                e.classList.add("active")
                selectedOptionHTML = e
            }
        }
    })
});

inputR.addEventListener("change",() => {
    let value = parseInt(inputR.value);
    if(value == undefined){
        return
    }      
    inputV.value = value
    lineW = value
})

color.addEventListener("change",() => {
    selectedColor = color.value + selectedOpacity
})

opacity.addEventListener("change",() => {
    opVal = parseInt(opacity.value)
    let hexOpVal = opVal.toString(16).toLowerCase()
    if(hexOpVal.length == 1){
        hexOpVal = hexOpVal + '0'
    }
    selectedOpacity = hexOpVal
    selectedColor = color.value + selectedOpacity
})

function tabChange(){

    // tabOptions.forEach(e => {
    //     if(selectedTab == e.dataset.tab){
    //         sideMenuArr.forEach(i => {
    //             if(i.dataset.tab != "draw"){
    //                 i.style.display = "none";
    //             }else{
    //                 i.style.display = "block"
    //             }
    //         })
    //     }
    // })

    if(selectedTab == "draw"){
        sideMenuArr.forEach(e => {
            if(e.dataset.tab != "draw" && e.dataset.tab != "common"){
                e.style.display = "none";
            }else{
                e.style.display = "block"
            }
        })
    }
    if(selectedTab == "shapes"){
        sideMenuArr.forEach(e => {
            if(e.dataset.tab != "shapes" && e.dataset.tab != "common"){
                e.style.display = "none";
            }else{
                e.style.display = "block"
            }
        })
    }
    if(selectedTab == "save"){
        sideMenuArr.forEach(e => {
            if(e.dataset.tab != "save"){
                e.style.display = "none"
            }else{
                e.style.display = "block"
            }
        })
    }
}

addEventListener("resize", () => {
    if(document.body.getBoundingClientRect().width > 1050){
        document.querySelector(".sidemenu").style.left = 'calc(100% - 250px)'
    }
})

ham.addEventListener("click",() => {
    if(document.body.getBoundingClientRect().width <= 1050){
        if(document.querySelector(".sidemenu").style.left == '100%'){
            document.querySelector(".sidemenu").style.left = 'calc(100% - 250px)'
            ham.children[0].src = "assets/cross.svg"
        }else{
            document.querySelector(".sidemenu").style.left = '100%'
            ham.children[0].src = "assets/ham.svg"
        }
     }else{
        document.querySelector(".sidemenu").style.left = 'calc(100% - 250px)'
     }
})

let files = []
document.querySelector(".add").addEventListener("click",() => {
    let file = document.createElement("div")
    file.classList.add("files")
    let button = document.createElement("button")
    button.innerHTML = "-"
    let spanData = prompt("Enter file name:")
    let span = document.createElement("span")
    span.innerHTML = spanData

    button.addEventListener("click",() => {
        const index = files.indexOf(file);
        if(index !== -1){
            files.splice(index,1)
        }
        deleteDrawing(index)
        file.remove()
    })

    file.addEventListener("click",() => {
        const index = files.indexOf(file);
        showDrawing(index)
    })

    file.appendChild(span)
    file.appendChild(button)
    files.push(file)
    addDrawing()
    savedfiles.appendChild(file)
})





