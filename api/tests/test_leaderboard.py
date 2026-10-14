def test_team_leaderboard(client, auth_user_headers):
    response = client.get("/api/v1/leaderboard/teams", headers=auth_user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    teams = data["data"]
    assert len(teams) >= 6
    # Verify sorted by rank / score
    assert teams[0]["score"] >= teams[1]["score"]

def test_user_leaderboard(client, auth_user_headers):
    response = client.get("/api/v1/leaderboard/users", headers=auth_user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    users = data["data"]
    assert len(users) >= 10
    assert users[0]["score"] >= users[1]["score"]
