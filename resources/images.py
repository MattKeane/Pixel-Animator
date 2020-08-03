from flask import Blueprint, request, jsonify, send_from_directory
from PIL import Image, ImageDraw
import uuid

black = (0, 0, 0)
white =(255, 255, 255)

def hex_to_rgb(hex):
	h = hex.lstrip("#")
	return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_gif(frames, image_uuid):
	images = []
	for frame in frames:
		image = Image.new("RGB", (200, 200), black)
		draw = ImageDraw.Draw(image)
		for i in range(len(frame)):
			for j in range(len(frame[i])):
				color = hex_to_rgb(frame[i][j])
				draw.rectangle([(j * 20, i * 20), (j * 20 + 20), (i * 20 + 20)], outline=color, fill=color)
		images.append(image)
	images[0].save(
		f"static/images/{image_uuid}.gif", 
		save_all=True, 
		append_images=images[1:],
		optimize=False,
		duration=40,
		loop=0)

images = Blueprint("images", "images")

@images.route("/", methods=["POST"])
def new_image():
	try:
		payload = request.get_json()
		image_uuid = uuid.uuid4()
		draw_gif(payload, image_uuid)
		return jsonify(
			data={"image_uuid": image_uuid},
			message="GIF Created",
			status=200), 200
	except:
		return jsonify(
			data={},
			message="An error occurred",
			status=400), 400

@images.route("/<image_name>", methods=["GET"])
def get_image(image_name):
	try:
		return send_from_directory("static/images", filename=f"{image_name}.gif", as_attachment=True)
	except FileNotFoundError:
		abort(404)