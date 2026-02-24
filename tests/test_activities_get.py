def test_get_activities(client):
    resp = client.get("/activities")
    assert resp.status_code == 200
    data = resp.json()
    # At least one known activity should be present
    assert "Chess Club" in data
    activity = data["Chess Club"]
    assert "description" in activity
    assert "participants" in activity
    assert isinstance(activity["participants"], list)
