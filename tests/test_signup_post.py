from src import app as _app
from src.app import activities


def test_signup_happy_path(client):
    activity_name = "Chess Club"
    email = "testuser@example.com"

    # Sign up
    resp = client.post(f"/activities/{activity_name}/signup", params={"email": email})
    assert resp.status_code == 200
    assert email in activities[activity_name]["participants"]


def test_signup_duplicate_returns_400(client):
    activity_name = "Chess Club"
    email = "duplicate@example.com"

    # First signup
    r1 = client.post(f"/activities/{activity_name}/signup", params={"email": email})
    assert r1.status_code == 200

    # Duplicate signup should fail
    r2 = client.post(f"/activities/{activity_name}/signup", params={"email": email})
    assert r2.status_code == 400


def test_signup_nonexistent_activity_returns_404(client):
    resp = client.post(f"/activities/NoSuchActivity/signup", params={"email": "x@example.com"})
    assert resp.status_code == 404
