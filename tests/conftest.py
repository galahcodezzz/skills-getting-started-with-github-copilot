import copy

import pytest
from fastapi.testclient import TestClient

from src.app import app, activities


@pytest.fixture(autouse=True)
def isolate_activities():
    """Snapshot and restore the module-level `activities` to keep tests isolated."""
    orig = copy.deepcopy(activities)
    try:
        yield
    finally:
        activities.clear()
        activities.update(orig)


@pytest.fixture
def client():
    return TestClient(app)
