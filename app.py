from flask import Flask, render_template

DEBUG = True
PORT = 8000

app = Flask(__name__)

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/test/")
def test_route():
	return "Hewwo World! UwU"

if __name__ == "__main__":
	app.run(debug=DEBUG, port=PORT)