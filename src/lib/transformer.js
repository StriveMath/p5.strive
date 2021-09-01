import {matrix, multiply, inv} from "mathjs";


export class Transformer {

    static basisMatrix = matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);

    constructor() {

    }

    static translate(x, y) {
        const transform = matrix(([[1, 0, 0], [0, 1, 0], [x, y, 1]]));
        this.basisMatrix = multiply(transform, this.basisMatrix);
        translate(x, y);
        return this.basisMatrix;
    }

    static rotate(angle) {
        const transform = matrix([[cos(angle), sin(angle), 0], [-sin(angle), cos(angle), 0], [0, 0, 1]]);
        this.basisMatrix = multiply(transform, this.basisMatrix);
        rotate(angle);
        return this.basisMatrix;
    }

    static scale(x, y) {
        const transform = matrix(([[x, 0, 0], [0, y, 0], [0, 0, 1]]));
        this.basisMatrix = multiply(transform, this.basisMatrix);
        scale(x, y);
        return this.basisMatrix;
    }


    static text(stg, x, y) {
        push();
        let yDir = this.basisMatrix.get([1, 1]);
        if (yDir < 0) {
            scale(1, -1);
            text(stg, x, -y);
        } else {
            text(stg, x, y);
        }
        pop();

    }

    static mouse() {
        const inverse = inv(this.basisMatrix);
        const tMouseX = mouseX * inverse.get([0, 0]) + mouseY * inverse.get([1, 0]) + 1 * inverse.get([2, 0]);
        const tMouseY = mouseX * inverse.get([0, 1]) + mouseY * inverse.get([1, 1]) + 1 * inverse.get([2, 1]);
        return {
            x: tMouseX,
            y: tMouseY,
        };
    }

    static reset() {
        this.basisMatrix = matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    }
}
