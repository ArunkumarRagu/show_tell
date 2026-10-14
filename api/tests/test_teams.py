def test_get_teams(client, auth_user_headers):
    response = client.get("/api/v1/teams", headers=auth_user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 6

def test_create_team_admin(client, auth_admin_headers):
    response = client.post(
        "/api/v1/teams",
        json={"name": "CyberDragons", "color": "#FF0000", "description": "Fire squad", "status": "active"},
        headers=auth_admin_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["data"]["name"] == "CyberDragons"

def test_create_team_user_forbidden(client, auth_user_headers):
    response = client.post(
        "/api/v1/teams",
        json={"name": "ForbiddenTeam", "color": "#000000"},
        headers=auth_user_headers
    )
    assert response.status_code == 403
