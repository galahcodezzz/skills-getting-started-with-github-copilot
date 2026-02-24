def test_root_redirects_to_static(client):
    resp = client.get("/", follow_redirects=False)
    assert resp.status_code in (301, 302, 307)
    assert resp.headers.get("location", "").endswith("/static/index.html")


def test_static_index_served(client):
    resp = client.get("/static/index.html")
    assert resp.status_code == 200
    text = resp.text.lower()
    assert "<html" in text or "<!doctype html" in text
