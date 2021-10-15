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
p5.prototype.RIGHT_HAND = 'right-hand';
p5.prototype.LEFT_HAND = 'left-hand';
p5.prototype._coordinateMode = p5.prototype.RIGHT_HAND;


/**
 * Transforms the coordinate system based on the current coordinateMode.
 */
p5.prototype._toRightHand = function _toRightHand() {
 if (this._coordinateMode === this.RIGHT_HAND) {
   this.scale(1, -1);
   this.translate(0, -this.height);
 }
};

/**
 * Transforms the coordinate system back to left-handed.
 */
 p5.prototype._undoRightHand = function _toRightHand() {
  if (this._coordinateMode === this.RIGHT_HAND) {
    this.scale(1, -1);
    this.translate(0, -this.height);
  }
 };


/**
 * Transforms the coordinate system before and after draw() is called.
 */
p5.prototype.registerMethod('pre', p5.prototype._toRightHand);
p5.prototype.registerMethod('post', p5.prototype._undoRightHand);


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

/**
 * Creates a wrapper function to simplify constructing p5.Oscillator objects.
 * 
 * @param {Number} freq defaults to 440Hz (Optional)
 * @param {String} type type of oscillator. Options: 'sine' (default),
 *                      'triangle', 'sawtooth', 'square' (Optional)
 */
p5.prototype.createOscillator = function _createOscillator(freq, type) {
  return new p5.Oscillator(freq, type);
};

// ====================================
// Transformations
// ====================================

p5.prototype.translate = function(x, y, z) {
  p5._validateParameters('translate', arguments);
  if (this._renderer.isP3D) {
    this._renderer.translate(x, y, z);
  } else {
    const transform = math.matrix(([[1, 0, 0], [0, 1, 0], [x, y, 1]]));
    this._basisMatrix = math.multiply(transform, this._basisMatrix);
    this._renderer.translate(x, y);
  }

  return this;
};

p5.prototype.rotate = function(angle, axis) {
  p5._validateParameters('rotate', arguments);
  const transform = math.matrix([[this.cos(angle), this.sin(angle), 0], [-this.sin(angle), this.cos(angle), 0], [0, 0, 1]]);
  this._basisMatrix = math.multiply(transform, this._basisMatrix);
  this._renderer.rotate(this._toRadians(angle), axis);
  return this;
};

p5.prototype.scale = function(x, y, z) {
  p5._validateParameters('scale', arguments);
  // Only check for Vector argument type if Vector is available
  if (x instanceof p5.Vector) {
    const v = x;
    x = v.x;
    y = v.y;
    z = v.z;
  } else if (x instanceof Array) {
    const rg = x;
    x = rg[0];
    y = rg[1];
    z = rg[2] || 1;
  }
  if (isNaN(y)) {
    y = z = x;
  } else if (isNaN(z)) {
    z = 1;
  }

  const transform = math.matrix(([[x, 0, 0], [0, y, 0], [0, 0, 1]]));
  this._basisMatrix = math.multiply(transform, this._basisMatrix);
  this._renderer.scale.call(this._renderer, x, y, z);

  return this;
};

// ====================================
// Typography
// ====================================

p5.prototype._text = p5.prototype.text;

p5.prototype.text = function(str, x, y, maxWidth, maxHeight) {
  p5._validateParameters('text', arguments);
  this.push();
  let yDir = this._basisMatrix.get([1, 1]);
  let output;
  if (yDir < 0) {
    this.scale(1, -1);
    output = this._text(str, x, -y, maxWidth, maxHeight);
    this.scale(1, -1)
  } else {
    output = this._text(str, x, y, maxWidth, maxHeight);
  }
  this.pop();

  return output;
};

p5.prototype.mouse = function() {
  const inverse = math.inv(this._basisMatrix);
  const tMouseX = this.mouseX * inverse.get([0, 0]) + this.mouseY * inverse.get([1, 0]) + 1 * inverse.get([2, 0]);
  const tMouseY = this.mouseX * inverse.get([0, 1]) + this.mouseY * inverse.get([1, 1]) + 1 * inverse.get([2, 1]);

  return {
    x: tMouseX,
    y: tMouseY,
  };
};

p5.prototype.registerMethod('init', function () {
  this._basisMatrix = math.matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
});

p5.prototype.registerMethod('post', function () {
  this._basisMatrix = math.matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
});

// ====================================
// Strive functions
// ====================================

p5.prototype.responsiveText = function(val, x, y) {
  const yScale = this._basisMatrix.get([1, 1]);
  if (yScale >= 0) {
      this.text(val, x, y);
  } else {
      this.push();
      this.scale(1, -1);
      this.text(val, x, -y);
      this.scale(1, -1);
      this.pop();
  }
};

p5.prototype.drawTickAxes = function(lineColor                      = 'rgb(20,45,217)',
                       thickness                      = 3, spacing = 50,
                       xoffset = 0, yoffset = 0, flip = false) {
  this.push();
  this.translate(xoffset, yoffset);
  for (let i = 0; i < this.height; i += spacing) {

      //vertical tickmarks
      this.stroke(lineColor);
      this.strokeWeight(thickness);
      this.line(5, i, -5, i);
      this.line(5, -i, -5, -i);

      //horizontal tickmarks
      this.line(i, +5, i, -5);
      this.line(-i, +5, -i, -5);

      this.fill('white');
      this.noStroke();

      this.responsiveText(i, 16, i);
      this.responsiveText(-i, 16, -i);


      this.responsiveText(i, i, 16);
      this.responsiveText(-i, -i, 16);


      this.strokeWeight(0.25);
      this.stroke(this.color('rgba(255,255,255,0.6)'));
      this.line(i, -this.height, i, this.height);
      this.line(-i, -this.height, -i, this.height);

      this.line(-this.width, i, this.width, i);
      this.line(-this.width, -i, this.width, -i);
  }
  this.stroke(lineColor);
  this.strokeWeight(5);
  //horizontal line
  this.line(-this.width, 0, this.width, 0);
  //vertical line
  this.line(0, this.height, 0, -this.height);

  this.pop();
};

p5.prototype.arrow = function(
  tailX, tailY,
  headX, headY
) {

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

p5.prototype.drawStrivePlane = function (size, red, green, blue){
  this.push()
  this.stroke(red, green, blue)
  this.drawOrigin(10)

  this.stroke(255)
  this.strokeWeight(2)
  this.fill(red, green, blue)
  this.drawXAxis(size, size/30)
  this.drawYAxis(size, size/30)
  this.drawZAxis(size, size/30)

  this.fill(red, green, blue, 35)
  this.noStroke()
  this.plane(2*size, 2*size)
  this.rotateX(90)
  this.plane(2*size, 2*size)
  this.rotateY(90)
  this.plane(2*size, 2*size)
  this.pop()
};

p5.prototype.drawOrigin = function(size){
  this.strokeWeight(size)
  this.point(0, 0, 0)
};

p5.prototype.drawZAxis = function(length, size){
  this.line(0, 0, 0, 0, 0, length);

  this.push();
  this.translate(0, 0, length);
  this.textSize(20);
  this.rotateX(90);
  this.noStroke();
  this.cone(size, 2*size);
  this.pop();
};

p5.prototype.drawYAxis = function(length, size){
  this.line(0, 0, 0, 0, length, 0);

  this.push();
  this.translate(0, length, 0);
  this.noStroke();
  this.cone(size, 2*size);
  this.pop();
};

p5.prototype.drawXAxis = function(length, size){
  this.line(0, 0, 0, length, 0, 0);

  this.push();
  this.translate(length, 0, 0);
  this.rotateZ(-90);
  this.noStroke();
  this.cone(size, 2*size);
  this.pop();
};

p5.prototype.tickAxes = function(lineColor                      = 'rgb(20,45,217)',
                       thickness                      = 3, spacing = 50,
                       xoffset = 0, yoffset = 0, flip = false) {
  this.push();
  this.translate(xoffset, yoffset);
  for (let i = 0; i < this.height; i += spacing) {
      //vertical tickmarks
      this.stroke(lineColor);
      this.strokeWeight(thickness);
      this.line(5, i, -5, i);
      this.line(5, -i, -5, -i);

      //horizontal tickmarks
      this.line(i, +5, i, -5);
      this.line(-i, +5, -i, -5);

      this.fill('white');
      this.noStroke();

      this.responsiveText(i, 16, i);
      this.responsiveText(-i, 16, -i);


      this.responsiveText(i, i, 16);
      this.responsiveText(-i, -i, 16);


      this.strokeWeight(0.25);
      this.stroke(this.color('rgba(255,255,255,0.6)'));
      this.line(i, -this.height, i, this.height);
      this.line(-i, -this.height, -i, this.height);

      this.line(-this.width, i, this.width, i);
      this.line(-this.width, -i, this.width, -i);
  }
  this.stroke(lineColor);
  this.strokeWeight(5);
  //horizontal line
  this.line(-this.width, 0, this.width, 0);
  //vertical line
  this.line(0, this.height, 0, -this.height);

  this.pop();
};

p5.prototype._anyMoving = false;

class MovableCircle {

  constructor(pInst, x, y, d) {
    this.pInst = pInst;
    this.x = x;
    this.y = y;
    this.d = d;
    this.isMovable = false;
    this.pInst._renderer.elt.addEventListener('mouseup', () => {
      this.pInst._anyMoving = false;
      this.isMovable = false;
    });
  }

  draw() {
    this.pInst.push();
    if (this.isMouseHovering() || this.isMovable) {
      this.pInst.fill('red');
    }
    if (this.isMovable) {
      this.x = this.pInst.mouse().x;
      this.y = this.pInst.mouse().y;
    }
    this.pInst.circle(this.x, this.y, this.d);
    this.makeMovable();
    this.pInst.pop();
  }

  isMouseHovering() {
      return this.pInst.dist(this.pInst.mouse().x, this.pInst.mouse().y, this.x, this.y) < this.d / 2;
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

p5.prototype.createMovableCircle = function(x, y, d) {
  return new MovableCircle(this, x, y, d);
};

// ====================================
// Mouse Coordinates
// ====================================

p5.prototype._updateNextMouseCoords = function(e) {
  if (this._curElement !== null && (!e.touches || e.touches.length > 0)) {
    const mousePos = getMousePos(
      this._curElement.elt,
      this.width,
      this.height,
      e
    );
    this._setProperty('movedX', e.movementX);
    this._setProperty('movedY', e.movementY);
    this._setProperty('mouseX', mousePos.x);
    this._setProperty('mouseY', mousePos.y);
    this._setProperty('winMouseX', mousePos.winX);
    this._setProperty('winMouseY', mousePos.winY);
  }
  if (!this._hasMouseInteracted) {
    // For first draw, make previous and next equal
    this._updateMouseCoords();
    this._setProperty('_hasMouseInteracted', true);
  }
};

p5.prototype._updateMouseCoords = function() {
  this._setProperty('pmouseX', this.mouseX);
  this._setProperty('pmouseY', this.mouseY);
  this._setProperty('pwinMouseX', this.winMouseX);
  this._setProperty('pwinMouseY', this.winMouseY);

  this._setProperty('_pmouseWheelDeltaY', this._mouseWheelDeltaY);
};

function getMousePos(canvas, w, h, evt) {
  if (evt && !evt.clientX) {
    // use touches if touch and not mouse
    if (evt.touches) {
      evt = evt.touches[0];
    } else if (evt.changedTouches) {
      evt = evt.changedTouches[0];
    }
  }
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.scrollWidth / w || 1;
  const sy = canvas.scrollHeight / h || 1;
  return {
    x: (evt.clientX - rect.left) / sx,
    y: (evt.clientY - rect.top) / sy,
    winX: evt.clientX,
    winY: evt.clientY,
    id: evt.identifier
  };
}

// ====================================
// 
// ====================================