export function drawStrivePlane(size, red, green, blue){
    push()
    stroke(red, green, blue)
    drawOrigin(10)

    stroke(255)
    strokeWeight(2)
    fill(red, green, blue)
    drawXAxis(size, size/30)
    drawYAxis(size, size/30)
    drawZAxis(size, size/30)

    fill(red, green, blue, 35)
    noStroke()
    plane(2*size, 2*size)
    rotateX(90)
    plane(2*size, 2*size)
    rotateY(90)
    plane(2*size, 2*size)
    pop()
}

function drawOrigin(size){
    strokeWeight(size)
    point(0, 0, 0)
}

function drawZAxis(length, size){
    line(0, 0, 0, 0, 0, length)

    push()
    translate(0, 0, length)
    textSize(20)
    rotateX(90)
    noStroke()
    cone(size, 2*size)
    pop()
}

function drawYAxis(length, size){
    line(0, 0, 0, 0, length, 0)

    push()
    translate(0, length, 0)
    noStroke()
    cone(size, 2*size)
    pop()
}

function drawXAxis(length, size){
    line(0, 0, 0, length, 0, 0)

    push()
    translate(length, 0, 0)
    rotateZ(-90)
    noStroke()
    cone(size, 2*size)
    pop()
}