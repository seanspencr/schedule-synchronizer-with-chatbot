from fastapi import FastAPI
from fastapi import APIRouter
from router import user_router, schedule_router
from database import db_connection

app = FastAPI()

app.include_router(user_router.router)
app.include_router(schedule_router.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}