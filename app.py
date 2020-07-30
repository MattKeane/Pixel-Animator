from flask import Flask

DEBUG = True
PORT = 8000

app = Flask(__name__)

@app.route("/")
def test_route():
	return "Hewwo World! UwU"

if __name__ == "__main__":
	app.run(debug=DEBUG, port=PORT)