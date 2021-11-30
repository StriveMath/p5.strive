from p5 import *

def setup():
  createCanvas(400, 400)
  

def draw():
  background('black')
  textSize(24)
  spacing = 100
  axisColor = 'hotpink'
  gridColor = 'ghostwhite'
  labelColor = 'dodgerblue'
  labelSize = 16
  axisThickness = 10
  tickThickness = 5
  gridThickness = 1
  drawTickAxes(
    spacing,
    axisColor,
    gridColor,
    labelColor,
    labelSize,
    axisThickness,
    tickThickness,
    gridThickness
  )
  fill('white')
  noStroke()
  circle(mouseX, mouseY, 10)
  text(f'\t({mouseX}, {mouseY})', mouseX, mouseY)
  circle(100, 200, 10)
  text('\t(100, 200)', 100, 200)
