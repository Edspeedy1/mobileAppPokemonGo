from PIL import Image
import os

def upscale_images():
    for filename in os.listdir('assets/creatureImages'):
        img = Image.open(os.path.join('assets/creatureImages', filename))
        img = img.resize((img.width * 4, img.height * 4), Image.NEAREST)
        img.save(os.path.join('assets/creatureImages', filename))

upscale_images()