from p5 import *

def setup():
  createCanvas(400, 400)
  

def draw():
  background('black')
  die(1, 50, 350)
  drawBarGraph([1, 2, 3, 3, 2, 1], 120, 120, 25)
  # translate(200, 200)
  # scaleFactor = 50
  # scale(scaleFactor)
  # drawTickAxes(scaleFactor)
  # r = 1
  # stroke('white')
  # strokeWeight(1/scaleFactor)
  # noFill()
  # circle(0, 0, 2 * r)
