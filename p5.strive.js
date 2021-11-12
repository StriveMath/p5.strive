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
  lineColor = "rgb(20,45,217)",
  thickness = 3,
  spacing = 50,
  xoffset = 0,
  yoffset = 0
) {
  this.push();
  this.textAlign(this.CENTER, this.CENTER);
  this.translate(xoffset, yoffset);
  for (let y = 0; y < this.height; y += spacing) {
    // tickmarks
    this.stroke(lineColor);
    this.strokeWeight(thickness);
    this.line(5, y, -5, y);
    this.line(5, -y, -5, -y);

    // labels
    if (y !== 0) {
      this.fill("white");
      this.noStroke();
      this.responsiveText(y, 2 * this.textSize(), y);
      this.responsiveText(-y, 2 * this.textSize(), -y);
    }

    // gridlines
    this.strokeWeight(0.25);
    this.stroke(this.color("rgba(255,255,255,0.6)"));
    this.line(-this.width, y, this.width, y);
    this.line(-this.width, -y, this.width, -y);
  }

  for (let x = 0; x < this.width; x += spacing) {
    // tickmarks
    this.stroke(lineColor);
    this.strokeWeight(thickness);
    this.line(x, +5, x, -5);
    this.line(-x, +5, -x, -5);

    // labels
    if (x !== 0) {
      this.fill("white");
      this.noStroke();
      this.responsiveText(x, x, 1.5 * this.textSize());
      this.responsiveText(-x, -x, 1.5 * this.textSize());
    }

    // gridlines
    this.strokeWeight(0.25);
    this.stroke(this.color("rgba(255,255,255,0.6)"));
    this.line(x, -this.height, x, this.height);
    this.line(-x, -this.height, -x, this.height);
  }
  this.stroke(lineColor);
  this.strokeWeight(5);
  // x-axis
  this.line(-this.width, 0, this.width, 0);
  // y-axis
  this.line(0, this.height, 0, -this.height);
  // origin
  this.fill("white");
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
  }

  _mouse() {
    const mouse = {};
    if (this.pInst._coordinateMode === this.pInst.RIGHT_HAND) {
      mouse.x = this.pInst.mouseX;
      mouse.y = this.pInst.height - this.pInst.mouseY;
    } else {
      mouse.x = this.pInst.mouseX;
      mouse.y = this.pInst.mouseY;
    }

    const tmouse = {};
    const inverse = math.inv(this.pInst._basisMatrix);
    tmouse.x =
      mouse.x * inverse.get([0, 0]) +
      mouse.y * inverse.get([1, 0]) +
      1 * inverse.get([2, 0]);
    tmouse.y =
      mouse.x * inverse.get([0, 1]) +
      mouse.y * inverse.get([1, 1]) +
      1 * inverse.get([2, 1]);

    return tmouse;
  }

  draw() {
    this.pInst.push();
    if (this.isMouseHovering() || this.isMovable) {
      this.pInst.fill(this.clr);
    }
    if (this.isMovable) {
      this.x = this._mouse().x;
      this.y = this._mouse().y;
    }
    this.pInst.circle(this.x, this.y, this.d);
    this.makeMovable();
    this.pInst.pop();
  }

  isMouseHovering() {
    return (
      this.pInst.dist(this._mouse().x, this._mouse().y, this.x, this.y) <
      this.d / 2
    );
  }

  makeMovable() {
    if (this.isMouseHovering() && !this.pInst._anyMoving) {
      if (this.pInst.mouseIsPressed) {
        this.pInst._anyMoving = true;
        this.isMovable = true;
      }
    }
  }
}

p5.prototype.createMovableCircle = function (x, y, d, clr = "red") {
  return new MovableCircle(this, x, y, d, clr);
};

p5.prototype.unixTime = function () {
  return Math.round(Date.now() / 1000);
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
  if (path === 'Press Start 2P') {
    _path = 'https://cdn.jsdelivr.net/gh/StriveMath/fonts/Press_Start_2P/PressStart2P-Regular.ttf';
  }
  this.assets[name] = this._loadFont(_path);
};
