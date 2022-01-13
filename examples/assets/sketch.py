from p5 import *


def setup():
  createCanvas(334, 334)
  loadFont('assets/PermanentMarker-Regular.ttf', 'font')
  loadSound('assets/pop.mp3', 'pop')
  loadImage('assets/ada.jpg', 'ada')
  

def draw():
  image(assets['ada'], 0, 0)
  drawBubble()


def mousePressed():
  assets['pop'].play()


def drawBubble():
  push()
  noStroke()
  ellipse(100, 275, 100, 50)
  triangle(75, 275, 125, 275, 150, 240)
  textFont(assets['font'])
  textAlign(CENTER, CENTER)
  fill('black')
  noStroke()
  text('Click to play!', 100, 275)
  pop()