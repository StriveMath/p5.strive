import {Transformer} from "./transformer";




export function tickAxes(lineColor                      = "rgb(20,45,217)",
                         thickness                      = 3, spacing = 50,
                         xoffset = 0, yoffset = 0, flip = false) {
    push();
    translate(xoffset, yoffset);
    for (let i = 0; i < height; i += spacing) {

        //vertical tickmarks
        stroke(lineColor);
        strokeWeight(thickness);
        line(5, i, -5, i);
        line(5, -i, -5, -i);

        //horizontal tickmarks
        line(i, +5, i, -5);
        line(-i, +5, -i, -5);

        fill("white");
        noStroke();

        responsiveText(i, 16, i);
        responsiveText(-i, 16, -i);


        responsiveText(i, i, 16);
        responsiveText(-i, -i, 16);


        strokeWeight(0.25);
        stroke(color("rgba(255,255,255,0.6)"));
        line(i, -height, i, height);
        line(-i, -height, -i, height);

        line(-width, i, width, i);
        line(-width, -i, width, -i);


    }
    stroke(lineColor);
    strokeWeight(5);
//horizontal line
    line(-width, 0, width, 0);
//vertical line
    line(0, height, 0, -height);

    pop();
};


function responsiveText(val, x, y) {
    const yScale = Transformer.basisMatrix.get([1, 1]);
    if (yScale >= 0) {
        text(val, x, y);
    } else {
        push();
        scale(1, -1);
        text(val, x, -y);
        pop();
    }
}
