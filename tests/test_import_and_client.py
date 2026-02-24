from src.app import app


def test_app_importable_and_client_works():
    from fastapi.testclient import TestClient

    client = TestClient(app)
    resp = client.get("/activities")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
