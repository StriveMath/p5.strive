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
p5.prototype._toRightHand = function _toRightHand() {
  if (this._coordinateMode === this.RIGHT_HAND) {
    this.rightHanded();
  }
};

p5.prototype.rightHanded = function _rightHanded() {
  if (this._renderer.isP3D) {
    this.scale(1, -1);
  } else {
    this.scale(1, -1);
    this.translate(0, -this.height);
  }
};

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

// ====================================
// Transformations
// ====================================

p5.prototype.translate = function (x, y, z) {
  p5._validateParameters("translate", arguments);
  if (this._renderer.isP3D) {
    const A = math.matrix([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ]);
    const Atrans = math.transpose(A);
    this._basisMatrix = math.multiply(Atrans, this._basisMatrix);
    this._renderer.translate(x, y, z);
  } else {
    const A = math.matrix([
      [1, 0, x],
      [0, 1, y],
      [0, 0, 1],
    ]);
    const Atrans = math.transpose(A);
    this._basisMatrix = math.multiply(Atrans, this._basisMatrix);
    this._renderer.translate(x, y);
  }

  return this;
};

p5.prototype.rotate = function (angle, axis) {
  p5._validateParameters("rotate", arguments);
  const A = math.matrix([
    [this.cos(-angle), this.sin(-angle), 0],
    [-this.sin(-angle), this.cos(-angle), 0],
    [0, 0, 1],
  ]);
  const Atrans = math.transpose(A);
  this._basisMatrix = math.multiply(Atrans, this._basisMatrix);
  this._renderer.rotate(this._toRadians(angle), axis);
  return this;
};

p5.prototype.scale = function (x, y, z) {
  p5._validateParameters("scale", arguments);
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

  if (this._renderer.isP3D) {
    const A = math.matrix([
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1],
    ]);
    const Atrans = math.transpose(A);
    this._basisMatrix = math.multiply(Atrans, this._basisMatrix);
  } else {
    const A = math.matrix([
      [x, 0, 0],
      [0, y, 0],
      [0, 0, 1],
    ]);
    const Atrans = math.transpose(A);
    this._basisMatrix = math.multiply(Atrans, this._basisMatrix);
  }

  this._renderer.scale.call(this._renderer, x, y, z);

  return this;
};

p5.prototype.push = function () {
  this._bases.push(math.matrix(this._basisMatrix));
  this._styles.push({
    props: {
      _colorMode: this._colorMode,
    },
    renderer: this._renderer.push(),
  });
};

p5.prototype.pop = function () {
  const style = this._styles.pop();
  if (style) {
    this._renderer.pop(style.renderer);
    Object.assign(this, style.props);
    this._basisMatrix = this._bases.pop();
  } else {
    console.warn("pop() was called without matching push()");
  }
};

p5.prototype.orbitControl = function (
  sensitivityX,
  sensitivityY,
  sensitivityZ
) {
  this._assert3d("orbitControl");
  p5._validateParameters("orbitControl", arguments);

  // If the mouse is not in bounds of the canvas, disable all behaviors:
  const mouseInCanvas =
    this.mouseX < this.width &&
    this.mouseX > 0 &&
    this.mouseY < this.height &&
    this.mouseY > 0;
  if (!mouseInCanvas) return;

  const cam = this._renderer._curCamera;

  if (typeof sensitivityX === "undefined") {
    sensitivityX = 1;
  }
  if (typeof sensitivityY === "undefined") {
    sensitivityY = sensitivityX;
  }
  if (typeof sensitivityZ === "undefined") {
    sensitivityZ = 0.5;
  }

  // default right-mouse and mouse-wheel behaviors (context menu and scrolling,
  // respectively) are disabled here to allow use of those events for panning and
  // zooming

  // disable context menu for canvas element and add 'contextMenuDisabled'
  // flag to p5 instance
  if (this.contextMenuDisabled !== true) {
    this.canvas.oncontextmenu = () => false;
    this._setProperty("contextMenuDisabled", true);
  }

  // disable default scrolling behavior on the canvas element and add
  // 'wheelDefaultDisabled' flag to p5 instance
  if (this.wheelDefaultDisabled !== true) {
    this.canvas.onwheel = () => false;
    this._setProperty("wheelDefaultDisabled", true);
  }

  const scaleFactor = this.height < this.width ? this.height : this.width;

  // ZOOM if there is a change in mouseWheelDelta
  if (this._mouseWheelDeltaY !== this._pmouseWheelDeltaY) {
    // zoom according to direction of mouseWheelDeltaY rather than value
    if (this._mouseWheelDeltaY > 0) {
      this._renderer._curCamera._orbit(0, 0, sensitivityZ * scaleFactor);
    } else {
      this._renderer._curCamera._orbit(0, 0, -sensitivityZ * scaleFactor);
    }
  }

  if (this.mouseIsPressed) {
    // ORBIT BEHAVIOR
    if (this.mouseButton === this.LEFT) {
      const deltaTheta =
        (-sensitivityX * (this.mouseX - this.pmouseX)) / scaleFactor;
      const deltaPhi =
        (sensitivityY * (this.mouseY - this.pmouseY)) / scaleFactor;
      if (this._coordinateMode === this.RIGHT_HAND) {
        this._renderer._curCamera._orbit(deltaTheta, -deltaPhi, 0);
      } else {
        this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
      }
    } else if (this.mouseButton === this.RIGHT) {
      // PANNING BEHAVIOR along X/Z camera axes and restricted to X/Z plane
      // in world space
      const local = cam._getLocalAxes();

      // normalize portions along X/Z axes
      const xmag = Math.sqrt(local.x[0] * local.x[0] + local.x[2] * local.x[2]);
      if (xmag !== 0) {
        local.x[0] /= xmag;
        local.x[2] /= xmag;
      }

      // normalize portions along X/Z axes
      const ymag = Math.sqrt(local.y[0] * local.y[0] + local.y[2] * local.y[2]);
      if (ymag !== 0) {
        local.y[0] /= ymag;
        local.y[2] /= ymag;
      }

      // move along those vectors by amount controlled by mouseX, pmouseY
      const dx = -1 * sensitivityX * (this.mouseX - this.pmouseX);
      const dz = -1 * sensitivityY * (this.mouseY - this.pmouseY);

      // restrict movement to XZ plane in world space
      cam.setPosition(
        cam.eyeX + dx * local.x[0] + dz * local.z[0],
        cam.eyeY,
        cam.eyeZ + dx * local.x[2] + dz * local.z[2]
      );
    }
  }
  return this;
};

// ====================================
// Typography
// ====================================
p5.prototype._text = p5.prototype.text;

p5.prototype.text = function (str, x, y, maxWidth, maxHeight) {
  p5._validateParameters("text", arguments);
  this.push();
  let yDir = this._basisMatrix.get([1, 1]);
  let output;
  if (yDir < 0) {
    this.scale(1, -1);
    output = this._text(str, x, -y, maxWidth, maxHeight);
    this.scale(1, -1);
  } else {
    output = this._text(str, x, y, maxWidth, maxHeight);
  }
  this.pop();

  return output;
};

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
// Strive functions
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
    tmouse.x = mouse.x * inverse.get([0, 0]) + mouse.y * inverse.get([1, 0]) + 1 * inverse.get([2, 0]);
    tmouse.y = mouse.x * inverse.get([0, 1]) + mouse.y * inverse.get([1, 1]) + 1 * inverse.get([2, 1]);

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
// Mouse Coordinates
// ====================================

p5.prototype._updateNextMouseCoords = function (e) {
  if (this._curElement !== null && (!e.touches || e.touches.length > 0)) {
    const mousePos = getMousePos(
      this._curElement.elt,
      this.width,
      this.height,
      e
    );
    if (this._coordinateMode === this.RIGHT_HAND) {
      mousePos.y = this.height - mousePos.y;
      mousePos.winY = this.height - mousePos.winY;
    }
    this._setProperty("movedX", e.movementX);
    this._setProperty("movedY", e.movementY);
    this._setProperty("mouseX", mousePos.x);
    this._setProperty("mouseY", mousePos.y);
    this._setProperty("winMouseX", mousePos.winX);
    this._setProperty("winMouseY", mousePos.winY);
  }
  if (!this._hasMouseInteracted) {
    // For first draw, make previous and next equal
    this._updateMouseCoords();
    this._setProperty("_hasMouseInteracted", true);
  }
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
    id: evt.identifier,
  };
}

p5.prototype.createCanvas = function (w, h, renderer) {
  p5._validateParameters("createCanvas", arguments);
  //optional: renderer, otherwise defaults to p2d
  const defaultClass = "p5Canvas";
  const r = renderer || "p2d";
  let c;

  if (r === "webgl") {
    this._basisMatrix = math.identity(4);
    c = document.getElementById(defaultId);
    if (c) {
      //if defaultCanvas already exists
      c.parentNode.removeChild(c); //replace the existing defaultCanvas
      const thisRenderer = this._renderer;
      this._elements = this._elements.filter((e) => e !== thisRenderer);
    }
    c = document.createElement("canvas");
    c.id = defaultId;
    c.classList.add(defaultClass);
  } else {
    this._basisMatrix = math.identity(3);
    if (!this._defaultGraphicsCreated) {
      c = document.createElement("canvas");
      let i = 0;
      while (document.getElementById(`defaultCanvas${i}`)) {
        i++;
      }
      defaultId = `defaultCanvas${i}`;
      c.id = defaultId;
      c.classList.add(defaultClass);
    } else {
      // resize the default canvas if new one is created
      c = this.canvas;
    }
  }

  // set to invisible if still in setup (to prevent flashing with manipulate)
  if (!this._setupDone) {
    c.dataset.hidden = true; // tag to show later
    c.style.visibility = "hidden";
  }

  if (this._userNode) {
    // user input node case
    this._userNode.appendChild(c);
  } else {
    //create main element
    if (document.getElementsByTagName("main").length === 0) {
      let m = document.createElement("main");
      document.body.appendChild(m);
    }
    //append canvas to main
    document.getElementsByTagName("main")[0].appendChild(c);
  }

  // Init our graphics renderer
  //webgl mode
  if (r === "webgl") {
    this._setProperty("_renderer", new p5.RendererGL(c, this, true));
    this._elements.push(this._renderer);
  } else {
    //P2D mode
    if (!this._defaultGraphicsCreated) {
      this._setProperty("_renderer", new p5.Renderer2D(c, this, true));
      this._defaultGraphicsCreated = true;
      this._elements.push(this._renderer);
    }
  }
  this._renderer.resize(w, h);
  this._renderer._applyDefaults();

  if (this._coordinateMode === this.RIGHT_HAND) {
    this.rightHanded();
  }
  return this._renderer;
};

p5.Element.prototype.position = function () {
  if (arguments.length === 0) {
    return { x: this.elt.offsetLeft, y: this.elt.offsetTop };
  } else {
    let positionType = "absolute";
    if (
      arguments[2] === "static" ||
      arguments[2] === "fixed" ||
      arguments[2] === "relative" ||
      arguments[2] === "sticky" ||
      arguments[2] === "initial" ||
      arguments[2] === "inherit"
    ) {
      positionType = arguments[2];
    }
    this.elt.style.position = positionType;
    this.elt.style.left = arguments[0] + "px";
    let y;
    if (this._pInst._coordinateMode === this._pInst.RIGHT_HAND) {
      y = this._pInst.height - arguments[1];
      this.elt.style.top = y + "px";
    } else {
      y = arguments[1];
      this.elt.style.top = y + "px";
    }
    this.x = arguments[0];
    this.y = y;
    return this;
  }
};

// Python renaming

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
