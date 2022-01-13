from p5 import *


def setup():
  createCanvas(400, 400, WEBGL)
  

def draw():
  background('black')
  orbitControl()
  draw3DAxes(100)