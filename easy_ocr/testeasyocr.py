"""
Dependencies: this step might freeze your computer
Note 1: For Windows, please install torch and torchvision first by following the official instructions here https://pytorch.org. On the pytorch website, be sure to select the right CUDA version you have. If you intend to run on CPU mode only, select CUDA = None.

pip install matplotlib easyocr opencv-python imutils Levenshtein
"""


import re
import cv2
import matplotlib.pyplot as plt
import easyocr
import numpy as np
import Levenshtein
from PIL import ImageFont, ImageDraw, Image


langs = ['en']
font = "calibrii.ttf"
gpu = True          # Makes processing faster if True, turn on only if u have a gpu

# returns the image with their text to the image
def write_text(text, x, y, img, font, color=(0,255,255), font_size=15):
    font = ImageFont.truetype(font, font_size)
    img_pil = Image.fromarray(img)
    draw = ImageDraw.Draw(img_pil)
    draw.text((x, y - font_size), text, font = font, fill = color)
    img = np.array(img_pil)
    return img

# takes in a list of lists of xi, yi => returns a four-tuple of (xi, yi)
def box_coordinates(box):
    (tl, tr, br, bl) = box
    tl = (int(tl[0]), int(tl[1]))
    tr = (int(tr[0]), int(tr[1]))
    br = (int(br[0]), int(br[1]))
    bl = (int(bl[0]), int(bl[1]))
    return tl, tr, br, bl

# Creates a rectangle given the tl and br coordinates
def draw_img(img, tl, br, color = (255, 0, 0), thickness=2):
    cv2.rectangle(img, tl, br, color, thickness)
    return img

# Filters a receipt by costco
def filter_costco(items, costs, text, passed):
    cost = re.match(r"^([0-9]+\.[0-9]+).*", text)
    item = re.match(r"^([0-9]+ [a-zA-Z0-9 ]*)$",text)
    item_str_only = re.match(r"^([a-zA-Z ]{2,})$", text)
    if cost:
        costs.append(cost.group(1))
        print(f"cost: {cost.group(1)}")
        passed = 1
    elif item:
        items.append(item.group(1))
        print(f"item: {item.group(1)}")
        passed = 1
    elif passed and item_str_only:
        items.append(item_str_only.group(1))
        print(f"item: {item_str_only.group(1)}")
    return passed

# checks if input string is "similar" to target string with Levenshtein distance
def similar(input_str, target_str, threshold=0.6):
    distance = Levenshtein.distance(input_str.lower(), target_str.lower())
    max_len = max(len(input_str), len(target_str))
    similarity = 1 - distance / max_len
    return similarity >= threshold

# Checks whether text is one of the brands, returning that brand
def receipt_type(text):
    brands = {"safeway", "costco"}
    similar_brand = [brand for brand in brands if similar(text, brand)] or None
    return similar_brand

# prints out cost, item pairs (Does not work)
def process_brand(brand, results):
    if brand == "costco":
        costs = []
        items = []
        passed = 0
        for (_, text, probability) in results:
            text = text.lower()
            if text == "subtotal":
                break
            passed = filter_costco(items, costs, text, passed)
        print(costs, items)

#
def process_receipt(results):
    brand = None
    for (_, text, probability) in results:
        text = text.lower()
        print(text)
        brand = receipt_type(text)
        if brand: break
    print(brand)
    process_brand(brand, results)

# gets box coords
# assigns tl and br
# draws the rectangles for them
# writes the text above the box
def display_stats(original, results):
    img = original.copy()
    for (box, text, probability) in results:
        print(text)
        if (probability):
            tl, tr, br, bl = box_coordinates(box)
            img = draw_img(img, tl, br)
            img = write_text(text, tl[0], tl[1], img, font)
    plt.imshow(img)
    plt.axis('off')
    plt.show()

# Main
image_path = 'images/safeway.png'
img = cv2.imread(image_path)
reader = easyocr.Reader(langs, gpu)     # reads it with easyOcr
result = reader.readtext(image_path)    # loading a model into memory
display_stats(img, result)              # displays the text read, and also will draw a box around recognized items
# process_receipt(result)
