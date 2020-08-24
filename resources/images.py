from flask import Blueprint, request, jsonify, send_from_directory
from PIL import Image, ImageDraw
import uuid


def hex_to_rgb(hex):
	h = hex.lstrip("#") + "01"
	return tuple(int(h[i:i+2], 16) for i in (0, 2, 4, 6))

def draw_gif(frames, image_uuid, delay=40, width=200, height=200, pixel_size=5):
	images = []
	for frame in frames:
		image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
		blank_image = Image.new("L", (width, height), 0)
		draw_blank = ImageDraw.Draw(blank_image)
		draw = ImageDraw.Draw(image)
		for i in range(len(frame)):
			for j in range(len(frame[i])):
				if frame[i][j]:
					color = hex_to_rgb(frame[i][j])
					draw.rectangle(
						[(j * pixel_size, i * pixel_size), (j * pixel_size + pixel_size), (i * pixel_size + pixel_size)], 
						outline=color, 
						fill=color)
				else:
					draw_blank.rectangle(
						[(j * pixel_size, i * pixel_size), (j * pixel_size + pixel_size), (i * pixel_size + pixel_size)],
						fill=255)
		image.putalpha(blank_image)
		images.append(image)
	images[0].save(
		f"static/images/{image_uuid}.gif", 
		save_all=True, 
		append_images=images[1:],
		optimize=False,
		duration=delay,
		transparency=0,
		disposal=2,
		loop=0)

images = Blueprint("images", "images")

@images.route("/", methods=["POST"])
def new_image():
	try:
		payload = request.get_json()
		image_uuid = uuid.uuid4()
		draw_gif(
			frames=payload["frames"], 
			image_uuid=image_uuid, 
			delay=payload["delay"],
			width=payload["width"],
			height=payload["height"],
			pixel_size=payload["pixelSize"])
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