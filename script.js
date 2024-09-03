let canvas = document.querySelector("canvas");
let clear = document.querySelector(".clear .clr")
let undo = document.querySelectorAll(".clear .ur")[0]
let redo = document.querySelectorAll(".clear .ur")[1]

let pngSave = document.querySelectorAll(".downoptions button")[0]
let jpegSave = document.querySelectorAll(".downoptions button")[1]

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

let ctx = canvas.getContext('2d');

let mouse = {
    x:undefined,
    y:undefined
}

let savedDrawings = []

let w = null
let h = null

let draw = false
let drawSpray =false
let drawRect = false
let drawCirc = false
let drawEllipse = false
let imageData = ctx.getImageData(0,0,canvas.width,canvas.height)

function selection(e){
    if(selectedOption == "pencil" || selectedOption == "eraser"){
        draw = true;
    }
    if(selectedOption == "spray"){
        drawSpray = true;
    }
    if(selectedOption == "rect"){
        drawRect = true;
        mouse.x = e.offsetX
        mouse.y = e.offsetY
    }
    if(selectedOption == "circle"){
        drawCirc = true
        mouse.x = e.offsetX
        mouse.y = e.offsetY
    }
    if(selectedOption == "ellipse"){
        drawEllipse = true
        mouse.x = e.offsetX
        mouse.y = e.offsetY
    }
}

canvas.addEventListener("mousedown", (e) => {
    selection(e)
    ctx.beginPath()
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height)
})

canvas.addEventListener("mouseup", (e) => {
    draw = false;
    prev.x = undefined
    prev.y = undefined
    drawRect = false
    drawCirc = false
    drawEllipse = false
    drawSpray = false
    movement = false
    saveState()
})

let prev = {
    x:undefined,
    y:undefined
}

const drawOnCanvas = (e) => {
    if(draw){
        ctx.putImageData(imageData,0,0)
    
        ctx.moveTo(prev.x,prev.y)
        ctx.lineCap = "round" 
        ctx.lineWidth = lineW
        ctx.lineTo(e.offsetX,e.offsetY) 
        prev.x = e.offsetX
        prev.y = e.offsetY
        ctx.strokeStyle = (selectedOption == "eraser") ? "white" : selectedColor
        ctx.stroke()     
    }

    if(drawSpray){
        // ctx.putImageData(imageData,0,0)
        r = lineW/2
        test(e.offsetX,e.offsetY,r)
    }

    if(drawRect){
        ctx.putImageData(imageData,0,0)

        ctx.beginPath()
        ctx.lineWidth = lineW
        let x = mouse.x
        let y = mouse.y
        let w = e.offsetX - mouse.x
        let h = e.offsetY - mouse.y
        if(w<0){
            w = Math.abs(w)
            x = e.offsetX
        }
        if(h<0){
            h = Math.abs(h)
            y = e.offsetY
        }
        if(w >= 2 && h >= 2){
            ctx.rect(x,y,w,h)
            ctx.strokeStyle = selectedColor
            ctx.stroke()
        }
    }

    if(drawCirc){
        ctx.putImageData(imageData,0,0)

        ctx.beginPath()
        ctx.lineWidth = lineW
        rad = Math.hypot(e.offsetX-mouse.x,e.offsetY-mouse.y)
        ctx.arc(mouse.x,mouse.y,rad,0,Math.PI*2)
        ctx.strokeStyle = selectedColor
        ctx.stroke()
    }

    if(drawEllipse){
        ctx.putImageData(imageData,0,0)

        ctx.beginPath()
        ctx.lineWidth = lineW
        let x = mouse.x
        let y = mouse.y
        radX = e.offsetX-mouse.x
        radY = e.offsetY-mouse.y
        if(radX<0){
            radX = Math.abs(radX)
            x = e.offsetX+radX
        }
        if(radY<0){
            radY = Math.abs(radY)
            y = e.offsetY+radY 
        }
        ctx.ellipse(x,y,radX,radY,0,0,Math.PI*2)
        ctx.strokeStyle = selectedColor
        ctx.stroke()
    }
}

function probability(){
    return Math.random()
}

function test(x,y,r){
    let centerX = x; 
    let centerY = y; 
    let radius = r; 
    ctx.beginPath();
    for(let i = centerX - radius; i < centerX + radius; i++){
        for(let j = centerY - radius; j < centerY + radius; j++){
            let distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
            let limit = 0.05
            if(radius < 7){
                limit = 0.5
            }
            if (distance <= radius && probability() < limit){
                ctx.fillStyle = selectedColor
                ctx.fillRect(i, j, 1, 1); 
            }
        }
    }
}

canvas.addEventListener("mousemove", drawOnCanvas)

let history = [];
let currentState = 0;
history.push(canvas.toDataURL())

function saveState() {
  currentState++;
  if (currentState < history.length) {
    history.splice(currentState);
  }
  history.push(canvas.toDataURL());
}

function undoF(){
    if (currentState > 0){
      currentState--;
      let canvasImage = new Image();
      canvasImage.src = history[currentState];
      canvasImage.onload = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImage, 0, 0);
       }
    }
    else if(currentState == 0){
      let canvasImage = new Image();
      canvasImage.src = history[currentState];
      canvasImage.onload = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImage, 0, 0);
       }
    }
}

function redoF() {
    if (currentState <= history.length - 1) {
      currentState++;
      let canvasImage = new Image();
      canvasImage.src = history[currentState];
      canvasImage.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImage, 0, 0);
       }
    }
}

clear.addEventListener("click",() => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
})
undo.addEventListener("click",() => {
    undoF()
})
redo.addEventListener("click",() => {
    redoF()
})


pngSave.addEventListener("click",() => {
    const pngDataURL = canvas.toDataURL("image/png")
    const filename = window.prompt('Enter filename (without extension):')
    if(filename){
        const downloadAnchor = document.createElement('a')
        downloadAnchor.href = pngDataURL
        downloadAnchor.download = `${filename}.png`
        downloadAnchor.click()
    }
})
jpegSave.addEventListener("click",() => {
    const pngDataURL = canvas.toDataURL("image/jpeg",0.8)
    const filename = window.prompt('Enter filename (without extension):')
    if(filename){
        const downloadAnchor = document.createElement('a')
        downloadAnchor.href = pngDataURL
        downloadAnchor.download = `${filename}.jpg`
        downloadAnchor.click()
    }
})

function addDrawing(){
    const image = canvas.toDataURL()
    index = files.length - 1;
    savedDrawings.push(image)
}

function deleteDrawing(i){
    savedDrawings.splice(i,1)
}

function showDrawing(i){
    let canvasImage = new Image();
    canvasImage.src = savedDrawings[i];
    canvasImage.onload = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(canvasImage, 0, 0);
    }
}



