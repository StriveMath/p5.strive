from p5 import *

def setup():
  createCanvas(400, 400)
  

def draw():
  background('black')
  translate(200, 200)
  scaleFactor = 50
  scale(scaleFactor)
  drawTickAxes(scaleFactor)
  r = 1
  stroke('white')
  strokeWeight(1/scaleFactor)
  noFill()
  circle(0, 0, 2 * r)
