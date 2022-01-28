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

/**
 * Constant to be used with the coordinateMode() function, to set the mode which
 * p5.js interprets and calculates angles (either LEFT_HAND or RIGHT_HAND).
 * @property {String} RIGHT_HAND
 * @final
 */
p5.prototype.RIGHT_HAND = "right-hand";

/**
 * Constant to be used with the coordinateMode() function, to set the mode which
 * p5.js interprets and calculates angles (either LEFT_HAND or RIGHT_HAND).
 * @property {String} LEFT_HAND
 * @final
 */
p5.prototype.LEFT_HAND = "left-hand";

// Set the default coordinate mode to right-handed.
p5.prototype._coordinateMode = p5.prototype.RIGHT_HAND;

/**
 * Transforms the coordinate system based on the current coordinateMode().
 */
p5.prototype.rightHanded = function () {
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
p5.prototype._toRightHand = function () {
  if (this._coordinateMode === this.RIGHT_HAND) {
    this.rightHanded();
  }
};

/**
 * Sets the camera position to its current position. No idea why
 * this is necessary, but it works!
 */
p5.prototype._camTinker = function () {
  if (this._renderer.isP3D) {
    const cam = this._renderer._curCamera;
    cam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ);
  }
};

/**
 * Transforms the coordinate system before draw() is called.
 */
p5.prototype.registerMethod("pre", p5.prototype._toRightHand);
p5.prototype.registerMethod("pre", p5.prototype._camTinker);

/**
 * Sets the coordinate system mode to either left-handed or right-handed.
 *
 * @param {Constant} mode either LEFT_HAND or RIGHT_HAND
 */
p5.prototype.coordinateMode = function (mode) {
  if (mode === this.LEFT_HAND || mode === this.RIGHT_HAND) {
    p5.prototype._coordinateMode = mode;
  }
};

// Set the default angleMode to degrees.
p5.prototype._angleMode = p5.prototype.DEGREES;

/**
 * Creates an empty Array to store basis matrices.
 */
p5.prototype.registerMethod("init", function () {
  this._bases = [];
});

/**
 * Initializes the basis matrix to the identity matrix.
 */
p5.prototype.registerMethod("post", function () {
  if (this._renderer.isP3D) {
    this._basisMatrix = math.identity(4);
  } else {
    this._basisMatrix = math.identity(3);
  }
});

// ====================================
// Strive Extensions
// ====================================

/**
 * Draws text that always "correctly", regardless of the coordinate system.
 *
 * @param {*} val the alphanumeric symbols to be displayed
 * @param {*} x   the x-coordinate of the text
 * @param {*} y   the y-coordinate of the text
 */
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

/**
 * Draws x and y-axes with tick marks, labels, and gridlines.
 *
 * @param {Number} scaleFactor    the scale factor applied to the coordinate system
 *                                prior to drawing the axes
 * @param {Number} spacing        the spacing between tick marks / gridlines
 * @param {p5.Color} axisColor    the color to draw the axes
 * @param {p5.Color} gridColor    the color to draw the gridlines
 * @param {p5.Color} labelColor   the color to draw the labels
 * @param {Number} labelSize      the size of the labels
 * @param {Number} axisThickness  the thickness to draw the axes
 * @param {Number} tickThickness  the thickness to draw the tick marks
 * @param {Number} gridThickness  the thickness to draw the gridlines
 */
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

/**
 * Draws a simple arrow given its tail (x,y) and head (x,y).
 * Adapted from the p5.js documentation for p5.Vector.
 *
 * @param {Number} tailX the x-coordinate of the arrow's tail
 * @param {Number} tailY the y-coordinate of the arrow's tail
 * @param {Number} headX the x-coordinate of the arrow's head
 * @param {Number} headY the y-coordinate of the arrow's head
 */
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

/**
 * Draws a set of x, y, and z-axes along with translucent planes.
 *
 * @param {Number} size  the extent of the axes
 * @param {p5.Color} clr the color to render the planes oriented along each axis
 */
p5.prototype.draw3DAxes = function (size, clr = "violet") {
  const _clr = this.color(clr);
  this.push();

  const sz = size / 30;
  this.stroke(255);
  this.fill(_clr);
  this.drawXAxis(size, sz);
  this.drawYAxis(size, sz);
  this.drawZAxis(size, sz);

  this.stroke(_clr);
  this.drawOrigin(sz);

  const planeSize = 2 * (size + sz);
  _clr.setAlpha(35);
  this.fill(_clr);
  this.noStroke();
  this.plane(planeSize, planeSize);
  this.rotateX(90);
  this.plane(planeSize, planeSize);
  this.rotateY(90);
  this.plane(planeSize, planeSize);
  this.pop();
};

/**
 * Draws a sphere at the origin in 3D.
 *
 * @param {Number} size the size of the origin (sphere) in 3D
 */
p5.prototype.drawOrigin = function (size) {
  this.sphere(size);
};

/**
 *  Draws the z-axis in 3D.
 *
 * @param {Number} length     the length of the axis
 * @param {Number} arrowSize  the size of the arrow (cone)
 */
p5.prototype.drawZAxis = function (length, arrowSize) {
  this.line(0, 0, 0, 0, 0, length);
  this.push();
  this.translate(0, 0, length);
  this.rotateX(90);
  this.noStroke();
  this.cone(arrowSize, 2 * arrowSize);
  this.pop();
};

/**
 * Draws the y-axis in 3D.
 *
 * @param {Number} length     the length of the axis
 * @param {Number} arrowSize  the size of the arrow (cone)
 */
p5.prototype.drawYAxis = function (length, arrowSize) {
  this.line(0, 0, 0, 0, length, 0);
  this.push();
  this.translate(0, length, 0);
  this.noStroke();
  this.cone(arrowSize, 2 * arrowSize);
  this.pop();
};

/**
 *  Draws the x-axis in 3D.
 *
 * @param {Number} length     the length of the axis
 * @param {Number} arrowSize  the size of the arrow (cone)
 */
p5.prototype.drawXAxis = function (length, arrowSize) {
  this.line(0, 0, 0, length, 0, 0);
  this.push();
  this.translate(length, 0, 0);
  this.rotateZ(-90);
  this.noStroke();
  this.cone(arrowSize, 2 * arrowSize);
  this.pop();
};

/**
 * @param {p5.Vector} O  the tail of the vector
 * @param {p5.Vector} V  the head of the vector
*/

p5.prototype.drawVector = function (O, V) {
  // assume parameters are vectors
  line(O.x, O.y, O.x+V.x, O.y+V.y)
  push()
  noStroke()
  translate(O.x, O.y)
  rotate(V.heading())
  translate(V.mag(), 0)
  scale(sqrt(V.mag())/10)
  triangle(0, 10, 0, -10, 10, 0)
  pop()
}

/**
 * Keeps track of the mouse's current position taking transformations
 * into account.
 *
 * @returns {Object} containing the mouse's x and y-coordinates
 */
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

// Boolean flag that indicates whether any MovableCircles are moving.
p5.prototype._anyMoving = false;

/**
 * A class to define a circle that users can drag about the canvas with
 * their mouse.
 */
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

/**
 *  Creates a circle that users can drag about the canvas with their mouse.
 *
 * @param {Number} x      the circle's x-coordinate
 * @param {Number} y      the circle's y-coordinate
 * @param {Number} d      the circle's diameter
 * @param {p5.Color} clr  the circle's color when hovered over (Optional)
 * @returns
 */
p5.prototype.createMovableCircle = function (x, y, d, clr = "red") {
  return new MovableCircle(this, x, y, d, clr);
};

/**
 *  Returns the current UNIX time in seconds.
 *
 * @returns {Number} the time
 */
p5.prototype.unixTime = function () {
  return Math.round(Date.now() / 1000);
};

/**
 *  Simplifies the task of running separate sketches by switching in response
 *  to key presses.
 *
 * @param {Number} numMilestones  the number of milestones
 * @param {String} path           the path to the folder containing sketches (Optional)
 * @param {String} prefix         the prefix used for files containing sketches (Optional)
 */
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

/**
 * Draws a single die that displays a number 1-6.
 *
 * @param {Number} roll         the number to display
 * @param {Number} x            the die's x-coordinate
 * @param {Number} y            the die's y-coordinate
 * @param {p5.Color} primary    the die's primary (background) color (Optional)
 * @param {p5.Color} secondary  the die's secondary (circle) color (Optional)
 */
p5.prototype.die = function (
  roll,
  x,
  y,
  primary = "white",
  secondary = "black"
) {
  if ([1, 2, 3, 4, 5, 6].indexOf(roll) < 0) {
    throw new p5Error("roll must be an integer from 1 to 6");
  }
  let s = 15;
  this.push();
  this.fill(primary);
  this.noStroke();
  this.rectMode(this.CENTER);
  this.square(x, y, 4 * s, 6);
  this.fill(secondary);
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

/**
 * Draws a simple bar graph given an Array of data.
 *
 * @param {Number[]} data   the data to graph
 * @param {Array} labels    the labels for the data (Optional)
 * @param {Number} width    the width of the graph (Optional)
 * @param {Number} height   the height of the graph (Optional)
 * @param {Number} barScale the scale factor from data values to bar height (Optional)
 */
p5.prototype.drawBarGraph = function (data, labels, width, height, barScale) {
  const ox = this._basisMatrix.get([2, 0]);
  const oy = this._basisMatrix.get([2, 1]);
  let _width;
  if (!width) {
    _width = this.width - ox - 16;
  } else {
    _width = width;
  }
  let _height;
  if (!height) {
    _height = this.height - (this.height - oy) - 16;
  } else {
    _height = height;
  }
  let barWidth = (_width - 2) / (2 * data.length);
  this.push();
  this.textAlign(this.CENTER, this.CENTER);
  // Axes
  this.push();
  this.noFill();
  this.line(0, 0, _width, 0);
  this.triangle(_width, 10, _width, -10, _width + 15, 0);
  this.line(0, 0, 0, _height);
  this.triangle(-10, _height, 10, _height, 0, _height + 15);
  this.pop();
  // Labels
  this.noStroke();
  // FIXME: this is a hack
  if (this.frameCount > 1) {
    if (labels) {
      for (let i = 0; i < data.length; i += 1) {
        let x = barWidth + 2 * i * barWidth;
        this.text(labels[i], x, -this.textSize());
      }
    } else {
      for (let i = 0; i < data.length; i += 1) {
        let x = barWidth + 2 * i * barWidth;
        this.text(i + 1, x, -this.textSize());
      }
    }
  }
  // Bars
  this.push();
  this.noStroke();
  let _barScale;
  if (!barScale) {
    _barScale = 5;
  } else {
    _barScale = barScale;
  }
  for (let i = 0; i < data.length; i += 1) {
    let x = 2 * i * barWidth + 1;
    this.rect(x, 1, 2 * barWidth, data[i] * _barScale);
  }
  this.pop();
};

// ====================================
// Python Compatibility
// ====================================

/**
 * Wraps p5's map() function since the name is already in use in Python.
 * Maps a number from one interval to another interval.
 *
 * @param {Number} value          the incoming value to be converted
 * @param {Number} start1         lower bound of the value's current range
 * @param {Number} stop1          upper bound of the value's current range
 * @param {Number} start2         upper bound of the value's current range
 * @param {Number} stop2          upper bound of the value's target range
 * @param {Boolean} withinBounds  constrain the value to the newly mapped range (Optional)
 * @returns
 */
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

/**
 *  A custom Error type that enables the FES to work from Python.
 *
 * @param {String} message the error message to display
 */
function p5Error(message = "") {
  this.name = "🌸 p5.js says";
  this.message = message;
}
p5Error.prototype = Error.prototype;

// ====================================
// Load Functions
//
// TODO: clean up, move to p5.js fork
// ====================================

// A global Object to contain assets loaded by the loadX() functions.
p5.prototype.assets = {};

// An internal counter for the number of assets yet to load.
p5.prototype._assetsRemaining = 0;

/**
 * Checks whether all assets have loaded.
 *
 * @returns {Boolean} whether all assets have loaded
 */
p5.prototype.assetsLoaded = function () {
  return this._preloadCount + this._assetsRemaining === 0;
};

// Alias for the loadSound() function
p5.prototype._loadSound = p5.prototype.loadSound;

/**
 * loadSound() returns a new p5.SoundFile from a specified path and
 * stores it in the global assets Object.
 *
 * @param {String} path the path to the sound file
 * @param {String} name the name of the sound file's key in the assets Object
 */
p5.prototype.loadSound = function (path, name) {
  this._assetsRemaining += 1;
  this.assets[name] = this._loadSound(path);
};

// Alias for the loadImage() function
p5.prototype._loadImage = p5.prototype.loadImage;

/**
 * Loads an image from a path, creates a p5.Image from it,
 * and stores it in the global assets Object.
 *
 * @param {String} path the path to the image file
 * @param {String} name the name of the image file's key in the assets Object
 */
p5.prototype.loadImage = function (path, name) {
  this._assetsRemaining += 1;
  this.assets[name] = this._loadImage(path);
};

// Alias for the loadFont() function
p5.prototype._loadFont = p5.prototype.loadFont;

/**
 * Loads an opentype font file (.otf, .ttf) from a file or a URL
 * and stores it in the global assets Object.
 *
 * @param {String} path the path to the font file
 * @param {String} name the name of the font file's key in the assets Object
 */
p5.prototype.loadFont = function (path, name) {
  this._assetsRemaining += 1;
  let _path = path;
  if (path === "Press Start 2P") {
    _path =
      "https://cdn.jsdelivr.net/gh/StriveMath/fonts/Press_Start_2P/PressStart2P-Regular.ttf";
  }
  this.assets[name] = this._loadFont(_path);
};
