from flask import Blueprint, request, jsonify
from PIL import Image, ImageDraw

black = (0, 0, 0)
white =(255, 255, 255)

def draw_gif(pixels):
	image = Image.new("RGB", (200, 200), black)
	draw = ImageDraw.Draw(image)
	for i in range(len(pixels)):
		for j in range(len(pixels[i])):
			colors = [black, white]
			color = colors[pixels[i][j]]
			draw.rectangle([(j * 20, i * 20), (j * 20 + 20), (i * 20 + 20)], outline=color, fill=color)
	image.save("static/client/test.gif")

images = Blueprint("images", "images")

@images.route("/", methods=["POST"])
def new_image():
	payload = request.get_json()
	print(payload)
	draw_gif(payload)
	return jsonify(
		data={},
		message="Check terminal",
		status=200), 200