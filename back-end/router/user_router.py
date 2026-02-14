from fastapi import APIRouter
from service import user_service

print("user router loaded")
router = APIRouter()

@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]

@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}

@router.post("/users/", tags=["users"])
async def create_user(name: str):
    print("Received request to create user with name:", name)
    return user_service.create_user(name)