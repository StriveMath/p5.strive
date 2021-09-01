export function arrow(
    tailX, tailY,
    headX, headY
) {

    let x = headX - tailX;
    let y = headY - tailY;

    push();

    translate(tailX, tailY);
    line(0, 0, x, y);

    if (x >= 0) {
        rotate(atan(y / x));
    } else {
        rotate(PI + atan(y / x));
    }

    let arrowSize = 7;
    translate(dist(0, 0, x, y) - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);

    pop();
}