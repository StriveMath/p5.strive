from p5 import *

def setup():
  createCanvas(600, 400)
  global s, p
  s = createSlider(0, 255, 100)
  s.position(205, 300)
  s.style('width', '100px')
  p = createMovableCircle(500, 100, 25)

def draw():
  background(s.value())
  p.draw()
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
