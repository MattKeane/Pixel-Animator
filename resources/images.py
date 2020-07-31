from flask import Blueprint, request, jsonify

images = Blueprint("images", "images")

@images.route("/", methods=["POST"])
def new_image():
	payload = request.get_json()
	print(payload)
	return jsonify(
		data={},
		message="Check terminal",
		status=200), 200