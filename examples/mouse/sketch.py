from p5 import *


def setup():
  createCanvas(400, 400)
  

def draw():
  background('black')
  translate(200, 200)
  rotate(45)
  drawTickAxes()
  x = mouse().x
  y = mouse().y
  circle(x, y, 50)