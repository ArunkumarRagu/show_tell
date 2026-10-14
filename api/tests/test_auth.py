def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"employee_id": "EMP001", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["employeeId"] == "EMP001"

def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"employee_id": "INVALID_EMP", "password": "wrong_password"}
    )
    assert response.status_code == 401

def test_get_current_user_profile(client, auth_user_headers):
    response = client.get("/api/v1/auth/me", headers=auth_user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["employeeId"] == "EMP001"
