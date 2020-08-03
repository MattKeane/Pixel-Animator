import pytest
from app import app

@pytest.fixture
def client():
	app.config["TESTING"] = True

	with app.test_client() as client:
		yield client

def test_index_route(client):
	# GET on the test route always gives a valid response
	rv = client.get("/")
	assert rv.status == "200 OK"

def test_create_pixel_invalid_payload(client):
	rv = client.post("/images/", data=0)
	assert rv.status == "400 BAD REQUEST"