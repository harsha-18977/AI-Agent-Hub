
import os
from datetime import datetime, timedelta, timezone

import jwt
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash
from dotenv import load_dotenv

from app.database import users_collection

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()
security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

if not JWT_SECRET or JWT_SECRET == "replace_this_with_a_random_secret":
    raise RuntimeError("Configure a secure JWT_SECRET in backend/.env")


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def create_access_token(user_id: str):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user_id,
        "exp": expires
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id or not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: RegisterRequest):
    email = user.email.lower()

    if users_collection.find_one({"email": email}):
        raise HTTPException(
            status_code=409,
            detail="Email is already registered"
        )

    document = {
        "name": user.name.strip(),
        "email": email,
        "password_hash": password_hash.hash(user.password),
        "created_at": datetime.now(timezone.utc)
    }

    result = users_collection.insert_one(document)

    return {
        "message": "Registration successful",
        "user": {
            "id": str(result.inserted_id),
            "name": document["name"],
            "email": document["email"]
        }
    }


@router.post("/login")
def login(user: LoginRequest):
    email = user.email.lower()

    existing_user = users_collection.find_one({"email": email})

    if not existing_user or not password_hash.verify(
        user.password,
        existing_user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(str(existing_user["_id"]))

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(existing_user["_id"]),
            "name": existing_user["name"],
            "email": existing_user["email"]
        }
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "user": {
            "id": str(current_user["_id"]),
            "name": current_user["name"],
            "email": current_user["email"]
        }
    }
