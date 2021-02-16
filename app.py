from flask import Flask, render_template
from flask_cors import CORS

from resources.images import images

DEBUG = True
PORT = 8000

app = Flask(__name__)

app.config.update(
  SESSION_COOKIE_SECURE=True,
  SESSION_COOKIE_SAMESITE='None'
)

CORS(images, origins=["http://localhost:3000", "https://pixel-wizard.herokuapp.com", "http://pixel-wizard.herokuapp.com"], supports_credentials=True)

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