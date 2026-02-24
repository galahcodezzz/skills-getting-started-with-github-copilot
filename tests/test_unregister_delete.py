from src.app import activities


def test_unregister_happy_path(client):
    activity_name = "Programming Class"
    email = "remove_me@example.com"

    # ensure present
    activities[activity_name]["participants"].append(email)

    resp = client.delete(f"/activities/{activity_name}/signup", params={"email": email})
    assert resp.status_code == 200
    assert email not in activities[activity_name]["participants"]


def test_unregister_missing_participant_returns_404(client):
    activity_name = "Programming Class"
    email = "not_present@example.com"

    # ensure not present
    if email in activities[activity_name]["participants"]:
        activities[activity_name]["participants"].remove(email)

    resp = client.delete(f"/activities/{activity_name}/signup", params={"email": email})
    assert resp.status_code == 404


def test_unregister_nonexistent_activity_returns_404(client):
    resp = client.delete(f"/activities/NoSuchActivity/signup", params={"email": "x@example.com"})
    assert resp.status_code == 404
