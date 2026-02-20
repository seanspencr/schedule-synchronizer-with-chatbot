from fastapi import FastAPI
from fastapi import APIRouter
from router import user_router, schedule_router
from database import db_connection
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

app.include_router(user_router.router)
app.include_router(schedule_router.router)
app.add_middleware(SessionMiddleware, secret_key="maklo")

@app.get("/")
async def root():
    return {"message": "Hello World"}