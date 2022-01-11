from p5 import *


def setup():
    createCanvas(400, 400)


def draw():
    background('black')
    drawTickAxes()
    circle(200, 200, 10)