import * as strive from "./src/lib"


window.setup = () => {
    createCanvas(500,500)
    angleMode(DEGREES)
}

window.draw = () => {
    background("black")
    Strive.translate(100,100)
    Strive.rotate(45)
    Strive.drawTickAxes()

}