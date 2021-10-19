from p5 import *

def setup():
  createCanvas(400, 400)
  global p1
  p1 = createMovableCircle(300, 300, 25)

def draw():
  background('black')

  p1.draw()

  drawTickAxes()

  push()
  translate(200, 200)
  scale(sin(frameCount))
  rotate(-frameCount)
  stroke('white')
  line(0, 0, 100, 50)
  pop()

  translate(100, 200)
  rotate(frameCount)
  rect(0, 0, 80, 20)
