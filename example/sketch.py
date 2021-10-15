from p5 import *

def setup():
  createCanvas(400, 400)

def draw():
  background('black')
  translate(200, 200)
  drawTickAxes()
  circle(50, 100, 10)
