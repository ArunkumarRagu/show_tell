from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class LoginRequest(BaseModel):
    employee_id: str = Field(..., description="Employee ID or Email")
    password: Optional[str] = Field(default=None, description="User password")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None
