from p5 import *


def setup():
  createCanvas(400, 400)
  frameRate(1)
  

def draw():
  background('black')
  drawTickAxes()
  
  roll = random([1, 2, 3, 4, 5, 6])
  die(roll, 100, 100)

  roll = random([1, 2, 3, 4, 5, 6])
  die(roll, 300, 300, "red", "white")