import pytesseract
from PIL import Image

# Set the Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ocr_image(image_path):
    # Configure pytesseract to use the Nepali language pack
    text = pytesseract.image_to_string(Image.open(image_path), lang='nep')
    return text
