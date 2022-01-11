from p5 import *


def setup():
    createCanvas(400, 400)

    background('black')
    fill('white')
    textAlign(CENTER, CENTER)
    text('Select a milestone 1–3 by pressing that key', 200, 200)
    
    createManager(3)