let canvas = document.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
let width = canvas.width = (window.innerWidth);
let height = canvas.height = (window.innerHeight);
let scale = 50
const sizeConstant = 0.03

///////// Camera management
let mouseOn, pmouseX, pmouseY, mouseX, mouseY;
const zoomSensitivity = 0.02
const moveSensitivity = 0.002
const maxMoveSpeed = 0.2
const maxScale = 120
const minScale = 40
const focalLength = 16
let displayCenterX = width / 2, displayCenterY = height / 2

//////// Camera position
const rho = 300
let theta = Math.PI / 2 - 1
let phi = 0
let cameraX, cameraY, cameraZ, canvasCenterX, canvasCenterY, canvasCenterZ
updateCameraXYZ()

let spinX = 0.1, spinY = 0.1, swap = 1

let projectionMatrix = [1, 0, 0,
    0, 1, 0,
    0, 0, 1]


////////////////////////////////////////////

function matrixDotVector(matrix, vector) {
    return [matrix[0] * vector[0] + matrix[1] * vector[1] + matrix[2] * vector[2],
        matrix[3] * vector[0] + matrix[4] * vector[1] + matrix[5] * vector[2],
        matrix[6] * vector[0] + matrix[7] * vector[1] + matrix[8] * vector[2]]
}


function norm(vector) {
    return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)
}

function multiplyVector(lambda, vector) {
    return [vector[0] * lambda, vector[1] * lambda, vector[2] * lambda]
}

function crossProduct(u, v) {
    return [u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0]]
}

function computeProjectionMatrix() {
    let u1 = [-cameraX, -cameraY, -cameraZ]
    let Z = canvasCenterZ + (canvasCenterX * cameraX + Math.min(1e4, canvasCenterY * cameraY)) / cameraZ
    let u2 = [canvasCenterX, canvasCenterY, canvasCenterZ - Z]
    let beta = Math.min(1e8, (Z - canvasCenterZ) / (canvasCenterY - (canvasCenterX * canvasCenterY) / cameraX))
    let alpha = -(cameraZ + cameraY * beta) / cameraX
    let u3 = [alpha, beta, 1]
    let u1Norm = norm(u1), u2Norm = norm(u2), u3Norm = norm(u3)
    let e1 = multiplyVector(1 / u1Norm, u1)
    let turn2 = Math.sign(u2[2])
    let e2 = multiplyVector(turn2 / u2Norm, u2)
    let turn3 = Math.sign(crossProduct(e1, e2)[0] * u3[0]) // pour avoir une base directe
    let e3 = multiplyVector(turn3 / u3Norm, u3)

    projectionMatrix = [e1[0], e2[0], e3[0],
        e1[1], e2[1], e3[1],
        e1[2], e2[2], e3[2]]
}


function projectOnCanvas(ke1, ke2, ke3) {
    let resX = scale * focalLength * ke3 / (ke1 + focalLength)
    let resY = scale * focalLength * ke2 / (ke1 + focalLength)
    return {x: displayCenterX + resX, y: displayCenterY - resY}
}


class Dot {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

        this.cx = x
        this.cy = y

        this.distanceToCamera = this.updateDistanceToCamera()
        this.size = sizeConstant / this.distanceToCamera
        this.color = 'hsla('+ Math.atan2(this.x, this.y) * (180 / Math.PI) + ',90%,' + (this.z-dz)*10 + '%,' + this.distanceToCamera/rho + ')'
        this.isHovered = false
        this.isClicked = false
    }

    updateDistanceToCamera() {
        return Math.sqrt((this.x - cameraX)**2 + (this.y - cameraY)**2 + (this.z - cameraZ)**2)
    }

    project() {
        let projectionVector = matrixDotVector(projectionMatrix, [this.x, swap * this.y, swap * this.z])
        let projectionOnCanvas = projectOnCanvas(projectionVector[0], projectionVector[1], projectionVector[2])
        this.cx = projectionOnCanvas.x + dxDraw
        this.cy = projectionOnCanvas.y
        this.updateDistanceToCamera()
        this.checkHover()
    }

    checkHover() {
        let distance = Math.sqrt((mouseX - this.cx)**2 + (mouseY - this.cy)**2)
        this.isHovered = (distance <= this.size)
        this.isClicked = this.isHovered && mouseOn
        if (this.isClicked) {
            document.getElementById('scrollBar').style.display = "block";
            sideOn = true
        }
    }

    updateColor() {
        if (this.isHovered) {
            this.color = 'white'
        }
        else {
            this.color = 'hsla('+ Math.atan2(this.x, this.y) * (180 / Math.PI) + ',90%,' + (this.z-dz)*10 + '%,' + this.distanceToCamera/rho + ')'
        }

    }

    draw() {
        this.size = sizeConstant * this.distanceToCamera
        this.updateColor()
        ctx.fillStyle = this.color
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}



class Line {
    constructor(startEndOpacity) {
        this.startX = startEndOpacity[0][0]
        this.startY = startEndOpacity[0][1]
        this.startZ = startEndOpacity[0][2]
        this.endX = startEndOpacity[1][0]
        this.endY = startEndOpacity[1][1]
        this.endZ = startEndOpacity[1][2]

        this.opacity = startEndOpacity[2]

        this.csx = this.startX
        this.csy = this.startY
        this.cex = this.endX
        this.cey = this.endY

    }

    project() {
        let projectionVectorStart = matrixDotVector(projectionMatrix, [this.startX, swap * this.startY, swap*this.startZ])
        let projectionVectorEnd = matrixDotVector(projectionMatrix, [this.endX, swap * this.endY, swap*this.endZ])
        let projectionOnCanvasStart = projectOnCanvas(projectionVectorStart[0], projectionVectorStart[1], projectionVectorStart[2])
        let projectionOnCanvasEnd = projectOnCanvas(projectionVectorEnd[0], projectionVectorEnd[1], projectionVectorEnd[2])
        this.csx = projectionOnCanvasStart.x
        this.csy = projectionOnCanvasStart.y
        this.cex = projectionOnCanvasEnd.x
        this.cey = projectionOnCanvasEnd.y
    }

    draw() {
        ctx.strokeStyle = 'hsla(0, 100%, 100%,' + this.opacity +')';
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.csx+dxDraw, this.csy);
        ctx.lineTo(this.cex+dxDraw, this.cey);
        ctx.stroke();
    }
}



class Legend {
    constructor(x, y, z, label, dx=0, dy=0) {
        this.x = x
        this.y = y
        this.z = z
        this.label = label
        this.dx = dx
        this.dy = dy

        this.cx = this.x
        this.cy = this.y
    }

    project() {
        let projectionVector = matrixDotVector(projectionMatrix, [this.x, swap * this.y, swap*this.z])
        let projectionOnCanvas = projectOnCanvas(projectionVector[0], projectionVector[1], projectionVector[2])

        this.cx = projectionOnCanvas.x
        this.cy = projectionOnCanvas.y
    }

    draw() {
        ctx.font = "30px Roboto";
        ctx.fillStyle = 'white'
        ctx.fillText(this.label, this.cx+this.dx+dxDraw, this.cy+this.dy);
    }
}





function updateCameraXYZ() {
    cameraX = rho * Math.sin(theta) * Math.cos(phi)
    cameraY = rho * Math.sin(theta) * Math.sin(phi)
    cameraZ = rho * Math.cos(theta)
    canvasCenterX = (rho - focalLength) * Math.sin(theta) * Math.cos(phi)
    canvasCenterY = (rho - focalLength) * Math.sin(theta) * Math.sin(phi)
    canvasCenterZ = (rho - focalLength) * Math.cos(theta)
}

function rotateCamera() {
    spinX = (mouseX - pmouseX) * moveSensitivity;
    spinY = (mouseY - pmouseY) * moveSensitivity;
    let mag = Math.sqrt(spinX ** 2 + spinY ** 2);
    if (mag > maxMoveSpeed) {
        spinX *= maxMoveSpeed / mag;
        spinY *= maxMoveSpeed / mag;
    }
    theta = (theta + spinX) % (2*Math.PI)
    if (theta < 0) {
        theta = 2 * Math.PI - 0.01
    }
    else {theta = Math.abs(theta)}

    //skip
    /* if (theta < 0.25) {
        theta = 6.1
    }
    else if (theta > 6.1) {
        theta = 0.25
    }
    else if (2.9 < theta && theta < 3.35) {
        theta = 3.1 + 0.25 * Math.sign(spinX)
    }
    console.log(phi) */
    swap = Math.sign(Math.PI - theta)
    phi = Math.min(phi + spinY, 0.8)
    updateCameraXYZ()
    computeProjectionMatrix()
}


function zoomCamera(zoom) {
    scale = Math.min(maxScale, Math.max(minScale, scale - zoom * zoomSensitivity))
}


function fusion(array1, array2) {
    if (array1.length === 0) {
        return array2
    }
    else if (array2.length === 0) {
        return array1
    }
    else {
        if (array1[0].distanceToCamera >= array2[0].distanceToCamera) {
            return [array1[0]].concat(fusion(array1.slice(1), array2))
        }
        else {
            return [array2[0]].concat(fusion(array1, array2.slice(1)))
        }
    }
}

function sortDots(array) {
    let l = array.length
    if (l <= 1) {
        return array
    }
    else {
        let l2 = Math.floor(l/2)
        return fusion(sortDots(array.slice(0, l2)), sortDots(array.slice(l2)))
    }
}



//////////////inputs/////////////////////
function mousePressed(e) {
    pmouseX = mouseX = e.offsetX;
    pmouseY = mouseY = e.offsetY;
    mouseOn = true;
}

function mouseReleased(e) {
    mouseOn = false;
}

function mouseDragged(e) {
    pmouseX = mouseX;
    pmouseY = mouseY;
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    if (mouseOn) {
        rotateCamera();
    }
}


function resizeCanvas() {
    width = canvas.width = (window.innerWidth);
    setTimeout(function () {
        height = canvas.height = (window.innerHeight);
    }, 0);
    centerX = width / 2;
    centerY = height / 2;
}


function draw() {
    if (sideOn) {
        dxDraw = -175
    }
    else {
        dxDraw = 0
    }

    dots = sortDots(dots);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < dots.length; i++) {
        dots[i].project()
    }

    let aDotIsHovered = false;
    for (let i = dots.length - 1; i >= 0; i--) {
        if (aDotIsHovered) {
            dots[i].isHovered = false
        }
        else {
            aDotIsHovered = dots[i].isHovered
        }
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].draw()
    }

    for (let i = 0; i < lines.length; i++) {
        lines[i].project()
        lines[i].draw()
    }

    for (let i = 0; i < labels.length; i++) {
        labels[i].project()
        labels[i].draw()
    }

    requestAnimationFrame(draw);
}


function clickUp() {
    console.log('up')
}

function clickDown() {
    console.log('down')
}

function showSplash() {
    let imageLink = document.getElementById('loading').src
    imageLink = imageLink.replace('loading', 'splash')
    document.getElementById('splash').src = imageLink
    document.getElementById('splash').style.display = "block";
    document.getElementById('splashBackground').style.display = "block";
}

function hideSplash() {
    document.getElementById('splash').style.display = "none";
    document.getElementById('splashBackground').style.display = "none";
}

function validateCoolFlow() {

    console.log('Valider')
}


//////////////////////////////////////////

let dz = -5, dxDraw = 0, sideOn = false

const gridLines = [[[-5, -5, dz], [-5, 5, dz], 0.3],
    [[-5, 5, dz], [5, 5, dz], 0.3],
    [[5, 5, dz], [5, -5, dz], 0.3],
    [[-5,-5, dz], [5, -5, dz], 0.3],

    [[-4, -5, dz], [-4, 5, dz], 0.3],
    [[-3, -5, dz], [-3, 5, dz], 0.3],
    [[-2, -5, dz], [-2, 5, dz], 0.3],
    [[-1, -5, dz], [-1, 5, dz], 0.3],
    [[0, -5, dz], [0, 5, dz], 1],
    [[1, -5, dz], [1, 5, dz], 0.3],
    [[2, -5, dz], [2, 5, dz], 0.3],
    [[3, -5, dz], [3, 5, dz], 0.3],
    [[4, -5, dz], [4, 5, dz], 0.3],

    [[-5, 4, dz], [5, 4, dz], 0.3],
    [[-5, 3, dz], [5, 3, dz], 0.3],
    [[-5, 2, dz], [5, 2, dz], 0.3],
    [[-5, 1, dz], [5, 1, dz], 0.3],
    [[-5, 0, dz], [5, 0, dz], 1],
    [[-5, -4, dz], [5, -4, dz], 0.3],
    [[-5, -3, dz], [5, -3, dz], 0.3],
    [[-5, -2, dz], [5, -2, dz], 0.3],
    [[-5, -1, dz], [5, -1, dz], 0.3],

    [[0, 0, dz], [0, 0, 10+dz], 1],
]

const labels = [new Legend(5.5, 0, -5, 'Cool'),
    new Legend(0, 5.5, -5, 'Flow'),
    new Legend(0, 0, 5.5, 'Reda', -31, 0),
]


let dots = [], lines = []

function initPts(n) {
    for (let i = 0; i < n; i++) {
        let x = 10*Math.random()-5, y = 10*Math.random()-5, z = (x**2 + y**2)/5 + dz
        dots.push(new Dot(x, y, z));
    }

    for (let i = 0; i < gridLines.length; i++) {
        lines.push(new Line(gridLines[i]));
    }

}



initPts(200);
draw();

resizeCanvas();

window.addEventListener( 'wheel', (e) => zoomCamera(e.deltaY))
window.addEventListener('mousedown', mousePressed);
window.addEventListener('mouseup', mouseReleased);
window.addEventListener('mousemove', mouseDragged);
window.onresize = resizeCanvas;
