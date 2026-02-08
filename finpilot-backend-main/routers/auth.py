from fastapi import APIRouter, HTTPException
from schemas.auth import UserRegister, UserLogin, UserResponse
from services import auth_service

router = APIRouter(tags=["Authentication"])

@router.post("/auth/register", response_model=UserResponse)
def register(user: UserRegister):
    try:
        return auth_service.register_user(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/login", response_model=UserResponse)
def login(creds: UserLogin):
    try:
        return auth_service.login_user(creds)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e)) # 401 = Unauthorized
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))