def test_get_activities(client, auth_user_headers):
    response = client.get("/api/v1/activities", headers=auth_user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 5

def test_submit_activity_quiz(client, auth_user_headers):
    # Submit answers for activity a1 (Code Review Sprint)
    response = client.post(
        "/api/v1/activities/a1/submit",
        json={"answers": [1, 1, 2], "timeTaken": 120},
        headers=auth_user_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert result["score"] == 100
    assert result["correctQuestions"] == 3
    assert result["status"] == "completed"
