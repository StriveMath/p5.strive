import p5 from "p5"
import {MovableCircle} from "./movable-circle";
import {tickAxes} from "./tick-axes";
import {Transformer} from "./transformer";
import {arrow} from "./arrow";
import {drawStrivePlane} from "./3d-axis";


export class Strive {
    constructor() {
        console.log("New Strive")
    }

    createMovableCircle(x, y, d) {
        return new MovableCircle(x, y, d);
    }

    drawStrivePlane(size, red, green, blue) {
        drawStrivePlane(size, red, green, blue)
    }

    drawTickAxes() {
        tickAxes();
    }

    translate(x, y) {
        Transformer.translate(x, y);
    }

    scale(x, y) {
        Transformer.scale(x, y);
    }

    rotate(angle) {
        Transformer.rotate(angle);
    }

    mouse() {
        return Transformer.mouse();
    }

    reset() {
        return Transformer.reset();
    }

    text(stg, x, y) {
        return Transformer.text(stg, x, y);
    }

    arrow(
        tailX, tailY,
        headX, headY,
    ) {
        arrow(
            tailX, tailY, headX, headY,
        );
    }
}


p5.prototype.Strive = new Strive()

p5.prototype.registerMethod("post", () => {
    Transformer.reset()
});

