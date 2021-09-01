import {Transformer} from "./transformer";

let anyMoving = false;

export class MovableCircle {


    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.isMovable = false;
        _renderer.elt.addEventListener("mouseup", this.mouseReleased);
    }

    draw() {
        push();
        if (this.isMouseHovering() || this.isMovable) {
            fill("red");
        }
        if (this.isMovable) {
            this.x = Transformer.mouse().x;
            this.y = Transformer.mouse().y;
        }
        circle(this.x, this.y, this.d);
        this.makeMovable();
        pop();
    }

    isMouseHovering() {
        return dist(Transformer.mouse().x, Transformer.mouse().y, this.x, this.y) < this.d / 2;
    }

    makeMovable() {
        if (this.isMouseHovering() && !anyMoving) {
            if (mouseIsPressed) {
                anyMoving = true;
                this.isMovable = true;
            }
        }
    }

    mouseReleased = () => {
        anyMoving = false;
        this.isMovable = false;
    };
}


