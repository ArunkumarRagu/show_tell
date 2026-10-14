def test_get_users(client, auth_user_headers):
    response = client.get("/api/v1/users", headers=auth_user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 10

def test_create_user_admin(client, auth_admin_headers):
    response = client.post(
        "/api/v1/users",
        json={
            "name": "New Developer",
            "employeeId": "EMP999",
            "email": "dev.new@hat.co",
            "role": "user",
            "status": "active"
        },
        headers=auth_admin_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["data"]["employeeId"] == "EMP999"
