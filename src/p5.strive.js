// ====================================
// Coordinate System
// ====================================

/**
 * By default, p5 uses a left-handed coordinate system with the origin placed
 * at the top-left corner of the canvas. This library overrides p5's default
 * behavior, creating a right-handed coordinate system with the origin placed
 * at the bottom-left corner of the canvas.
 *
 * In other words, the canvas is now Quadrant I from math class.
 */
p5.prototype.RIGHT_HAND = "right-hand";
p5.prototype.LEFT_HAND = "left-hand";
p5.prototype._coordinateMode = p5.prototype.RIGHT_HAND;

/**
 * Transforms the coordinate system based on the current coordinateMode.
 */
p5.prototype.rightHanded = function _rightHanded() {
  if (this._renderer.isP3D) {
    this.scale(1, -1);
  } else {
    this.scale(1, -1);
    this.translate(0, -this.height);
  }
};

/**
 * Transforms the coordinate system based on the current coordinateMode.
 */
p5.prototype._toRightHand = function _toRightHand() {
  if (this._coordinateMode === this.RIGHT_HAND) {
    this.rightHanded();
  }
};

/**
 * Sets the camera position to its current position. No idea why
 * this is necessary, but it works!
 */
p5.prototype._camTinker = function _camTinker() {
  if (this._renderer.isP3D) {
    const cam = this._renderer._curCamera;
    cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ);
  }
};

/**
 * Transforms the coordinate system before and after draw() is called.
 */
p5.prototype.registerMethod("pre", p5.prototype._toRightHand);
p5.prototype.registerMethod("pre", p5.prototype._camTinker);
//  p5.prototype.registerMethod('post', p5.prototype._undoRightHand);

/**
 * Sets the coordinate system mode to either left-handed or right-handed.
 *
 * @param {Constant} mode either LEFT_HAND or RIGHT_HAND
 */
p5.prototype.coordinateMode = function _coordinateMode(mode) {
  if (mode === this.LEFT_HAND || mode === this.RIGHT_HAND) {
    p5.prototype._coordinateMode = mode;
  }
};

/**
 * Set the default angleMode to degrees.
 */
p5.prototype._angleMode = p5.prototype.DEGREES;

p5.prototype.registerMethod("init", function () {
  this._bases = [];
});

p5.prototype.registerMethod("post", function () {
  if (this._renderer.isP3D) {
    this._basisMatrix = math.identity(4);
  } else {
    this._basisMatrix = math.identity(3);
  }
});

// ====================================
// Strive Functions
// ====================================

p5.prototype.responsiveText = function (val, x, y) {
  const yScale = this._basisMatrix.get([1, 1]);
  if (yScale >= 0) {
    this.text(val, x, y);
  } else {
    this.push();
    this.scale(1, -1);
    this.text(val, x, -y);
    this.pop();
  }
};

p5.prototype.drawTickAxes = function (
  scaleFactor = 1,
  spacing = 50,
  axisColor = "rgb(20,45,217)",
  gridColor = "rgba(255,255,255,0.6)",
  labelColor = "white",
  labelSize = 12,
  axisThickness = 5,
  tickThickness = 3,
  gridThickness = 0.25
) {
  this.push();
  this.textSize(labelSize / scaleFactor);
  this.textAlign(this.CENTER, this.CENTER);
  for (let y = 0; y < this.height / scaleFactor; y += spacing / scaleFactor) {
    // tickmarks
    this.stroke(axisColor);
    this.strokeWeight(tickThickness / scaleFactor);
    this.line(5 / scaleFactor, y, -5 / scaleFactor, y);
    this.line(5 / scaleFactor, -y, -5 / scaleFactor, -y);

    // labels
    if (y !== 0) {
      this.fill(labelColor);
      this.noStroke();
      this.responsiveText(y, 2 * this.textSize(), y);
      this.responsiveText(-y, 2 * this.textSize(), -y);
    }

    // gridlines
    this.strokeWeight(gridThickness / scaleFactor);
    this.stroke(this.color(gridColor));
    this.line(-this.width / scaleFactor, y, this.width / scaleFactor, y);
    this.line(-this.width / scaleFactor, -y, this.width / scaleFactor, -y);
  }

  for (let x = 0; x < this.width / scaleFactor; x += spacing / scaleFactor) {
    // tickmarks
    this.stroke(axisColor);
    this.strokeWeight(tickThickness / scaleFactor);
    this.line(x, 5 / scaleFactor, x, -5 / scaleFactor);
    this.line(-x, 5 / scaleFactor, -x, -5 / scaleFactor);

    // labels
    if (x !== 0) {
      this.fill(labelColor);
      this.noStroke();
      this.responsiveText(x, x, 1.5 * this.textSize());
      this.responsiveText(-x, -x, 1.5 * this.textSize());
    }

    // gridlines
    this.strokeWeight(gridThickness / scaleFactor);
    this.stroke(this.color(gridColor));
    this.line(x, -this.height, x, this.height);
    this.line(-x, -this.height, -x, this.height);
  }
  this.stroke(axisColor);
  this.strokeWeight(axisThickness / scaleFactor);
  // x-axis
  this.line(-this.width / scaleFactor, 0, this.width / scaleFactor, 0);
  // y-axis
  this.line(0, this.height / scaleFactor, 0, -this.height / scaleFactor);
  // origin
  this.fill(labelColor);
  this.noStroke();
  this.responsiveText(0, this.textSize(), this.textSize());
  this.pop();
};

p5.prototype.arrow = function (tailX, tailY, headX, headY) {
  let x = headX - tailX;
  let y = headY - tailY;

  this.push();

  this.translate(tailX, tailY);
  this.line(0, 0, x, y);

  if (x >= 0) {
    this.rotate(this.atan(y / x));
  } else {
    this.rotate(this.PI + this.atan(y / x));
  }

  let arrowSize = 7;
  this.translate(this.dist(0, 0, x, y) - arrowSize, 0);
  this.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);

  this.pop();
};

p5.prototype.draw3DAxes = function (size, redVal, greenVal, blueVal) {
  this.push();
  this.stroke(redVal, greenVal, blueVal);
  this.drawOrigin(10);

  this.stroke(255);
  this.strokeWeight(2);
  this.fill(redVal, greenVal, blueVal);
  this.drawXAxis(size, size / 30);
  this.drawYAxis(size, size / 30);
  this.drawZAxis(size, size / 30);

  this.fill(redVal, greenVal, blueVal, 35);
  this.noStroke();
  this.plane(2 * size, 2 * size);
  this.rotateX(90);
  this.plane(2 * size, 2 * size);
  this.rotateY(90);
  this.plane(2 * size, 2 * size);
  this.pop();
};

p5.prototype.drawOrigin = function (size) {
  this.strokeWeight(size);
  this.point(0, 0, 0);
};

p5.prototype.drawZAxis = function (length, size) {
  this.line(0, 0, 0, 0, 0, length);

  this.push();
  this.translate(0, 0, length);
  this.rotateX(90);
  this.noStroke();
  this.cone(size, 2 * size);
  this.pop();
};

p5.prototype.drawYAxis = function (length, size) {
  this.line(0, 0, 0, 0, length, 0);

  this.push();
  this.translate(0, length, 0);
  this.noStroke();
  this.cone(size, 2 * size);
  this.pop();
};

p5.prototype.drawXAxis = function (length, size) {
  this.line(0, 0, 0, length, 0, 0);

  this.push();
  this.translate(length, 0, 0);
  this.rotateZ(-90);
  this.noStroke();
  this.cone(size, 2 * size);
  this.pop();
};

p5.prototype.mouse = function () {
  const m = {};
  if (this._coordinateMode === this.RIGHT_HAND) {
    m.x = this.mouseX;
    m.y = this.height - this.mouseY;
  } else {
    m.x = this.mouseX;
    m.y = this.mouseY;
  }

  const tm = {};
  const inverse = math.inv(this._basisMatrix);
  tm.x =
    m.x * inverse.get([0, 0]) +
    m.y * inverse.get([1, 0]) +
    1 * inverse.get([2, 0]);
  tm.y =
    m.x * inverse.get([0, 1]) +
    m.y * inverse.get([1, 1]) +
    1 * inverse.get([2, 1]);

  return tm;
};

p5.prototype._anyMoving = false;

class MovableCircle {
  constructor(pInst, x, y, d, clr = "red") {
    this.pInst = pInst;
    this.x = x;
    this.y = y;
    this.d = d;
    this.clr = clr;
    this.isMovable = false;
    this.pInst._renderer.elt.addEventListener("mouseup", () => {
      this.pInst._anyMoving = false;
      this.isMovable = false;
    });
    this.locked = { x: "free", y: "free" };
  }

  draw() {
    this.pInst.push();
    if (this.isMouseHovering() || this.isMovable) {
      this.pInst.fill(this.clr);
    }
    if (this.isMovable) {
      if (this.locked.x === "free") {
        this.x = this.pInst.mouse().x;
      }

      if (this.locked.y === "free") {
        this.y = this.pInst.mouse().y;
      }
    }
    this.pInst.circle(this.x, this.y, this.d);
    this.makeMovable();
    this.pInst.pop();
  }

  isMouseHovering() {
    const m = this.pInst.mouse();
    return this.pInst.dist(m.x, m.y, this.x, this.y) < this.d / 2;
  }

  makeMovable() {
    if (this.isMouseHovering() && !this.pInst._anyMoving) {
      if (this.pInst.mouseIsPressed) {
        this.pInst._anyMoving = true;
        this.isMovable = true;
      }
    }
  }

  lock(coordinate, value) {
    if (coordinate === "x") {
      this.locked.x = value;
      this.x = value;
    } else if (coordinate === "y") {
      this.locked.y = value;
      this.y = value;
    }
  }
}

p5.prototype.createMovableCircle = function (x, y, d, clr = "red") {
  return new MovableCircle(this, x, y, d, clr);
};

p5.prototype.unixTime = function () {
  return Math.round(Date.now() / 1000);
};

p5.prototype.createManager = function (
  numMilestones,
  path = "milestones",
  prefix = "m"
) {
  document.addEventListener("keypress", function (event) {
    for (let i = 0; i < numMilestones; i += 1) {
      if (event.keyCode === 49 + i) {
        const pre = document.getElementById("output");
        if (!pre === null) {
          pre.remove();
        }

        const div = document.getElementById("sketch-holder");
        if (!div === null) {
          div.remove();
        }

        const filename = `${path}/${prefix}${i + 1}.py`;
        runCode(filename);
        break;
      }
    }
  });
};

p5.prototype.die = function (roll, x, y, clr = "red") {
  let s = 15;
  this.push();
  this.fill(clr);
  this.noStroke();
  this.rectMode(this.CENTER);
  this.square(x, y, 4 * s, 6);
  this.fill("white");
  if (roll === 1) {
    this.circle(x, y, s);
  } else if (roll === 2) {
    this.circle(x + s, y - s, s);
    this.circle(x - s, y + s, s);
  } else if (roll === 3) {
    this.circle(x, y, s);
    this.circle(x + s, y - s, s);
    this.circle(x - s, y + s, s);
  } else if (roll === 4) {
    this.circle(x + s, y - s, s);
    this.circle(x - s, y + s, s);
    this.circle(x + s, y + s, s);
    this.circle(x - s, y - s, s);
  } else if (roll === 5) {
    this.circle(x, y, s);
    this.circle(x + s, y - s, s);
    this.circle(x - s, y + s, s);
    this.circle(x + s, y + s, s);
    this.circle(x - s, y - s, s);
  } else {
    this.circle(x + s, y - (s * 6) / 5, s);
    this.circle(x - s, y + (s * 6) / 5, s);
    this.circle(x + s, y + (s * 6) / 5, s);
    this.circle(x - s, y - (s * 6) / 5, s);
    this.circle(x - s, y, s);
    this.circle(x + s, y, s);
  }
  this.pop();
};

p5.prototype.drawBarGraph = function (
  array,
  ox = 50,
  oy = 50,
  barHeight = 2,
  barColor = "red",
  axisColor = "white"
) {
  let xWidth = this.width - ox - 15;
  let yHeight = this.height - oy - 15;
  let barWidth = xWidth / (2 * array.length);
  this.push();
  this.textAlign(this.CENTER, this.CENTER);
  this.translate(ox, oy);
  // Axes
  this.fill(axisColor);
  this.stroke(axisColor);
  this.line(0, 0, xWidth, 0);
  this.triangle(xWidth, 10, xWidth, -10, xWidth + 15, 0);
  this.line(0, 0, 0, yHeight);
  this.triangle(-10, yHeight, 10, yHeight, 0, yHeight + 15);
  // Labels
  this.noStroke();
  // FIXME: this is a hack
  if (this.frameCount > 1) {
    for (let i = 0; i < array.length; i += 1) {
      let x = barWidth + 2 * i * barWidth;
      this.text(i + 1, x, -this.textSize());
    }
  }
  // Bars
  this.fill(barColor);
  this.stroke(axisColor);
  for (let i = 0; i < array.length; i += 1) {
    let x = 2 * i * barWidth;
    this.rect(x, 0, 2 * barWidth, array[i] * barHeight);
  }
};

// ====================================
// Python Compatibility
// ====================================

p5.prototype.linmap = function (
  value,
  start1,
  stop1,
  start2,
  stop2,
  withinBounds
) {
  return this.map(value, start1, stop1, start2, stop2, withinBounds);
};

// ====================================
// Load Functions
//
// TODO: clean up, move to p5.js fork
// ====================================
p5.prototype.assets = {};

p5.prototype._assetsRemaining = 0;

p5.prototype.assetsLoaded = function () {
  return this._preloadCount + this._assetsRemaining === 0;
};

p5.prototype._loadSound = p5.prototype.loadSound;

p5.prototype.loadSound = function (path, name) {
  this._assetsRemaining += 1;
  this.assets[name] = this._loadSound(path);
};

p5.prototype._loadImage = p5.prototype.loadImage;

p5.prototype.loadImage = function (path, name) {
  this._assetsRemaining += 1;
  this.assets[name] = this._loadImage(path);
};

p5.prototype._loadFont = p5.prototype.loadFont;

p5.prototype.loadFont = function (path, name) {
  this._assetsRemaining += 1;
  let _path = path;
  if (path === "Press Start 2P") {
    _path =
      "https://cdn.jsdelivr.net/gh/StriveMath/fonts/Press_Start_2P/PressStart2P-Regular.ttf";
  }
  this.assets[name] = this._loadFont(_path);
};
