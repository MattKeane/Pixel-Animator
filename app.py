from flask import Flask, render_template

from resources.images import images

DEBUG = True
PORT = 8000

app = Flask(__name__)

app.register_blueprint(images, url_prefix="/images/")

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/test/")
def test_route():
	print("Test route hit")
	return "Hewwo World! UwU"

if __name__ == "__main__":
	app.run(debug=DEBUG, port=PORT)