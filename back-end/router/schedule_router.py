from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer
from service import user_service, schedule_service
from utilmodel.token import Token, TokenData
from utilmodel.json_serial import json_serial
from lib.auth import create_access_token, get_current_user_from_cookie, verify_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.config import Config
from database.database_model import Users, Schedules
from fastapi.encoders import jsonable_encoder
import datetime
from fastapi.responses import JSONResponse
from json import dumps

router = APIRouter()

@router.get("/schedules/", tags=["schedules"])
async def read_schedules(user : Users = Depends(get_current_user_from_cookie)):
    return schedule_service.get_all_schedules_by_user_id(user.id)

@router.post("/schedules/create/", tags=["schedules"])
async def create_schedule(event_date: datetime.date, start_time: datetime.time, end_time: datetime.time, event: str, user : Users = Depends(get_current_user_from_cookie)):
    print("Received request to create schedule with event:", event)
    schedule = schedule_service.create_schedule(
        event_date=event_date,
        start_time=start_time,
        end_time=end_time,
        event=event,
        user_id=user.id
    )
    
    res = schedule.model_dump(mode="json")
    return res


@router.post("/schedules/recurrence/create/", tags=["recurrence"])
async def create_schedule_recurrences(recurrence_interval : int, recurrence_period : str, user : Users = Depends(get_current_user_from_cookie)):
    print("Received request to create schedule recurrence with interval:", recurrence_interval, "and period:", recurrence_period)
    schedule_recurrence = schedule_service.create_schedule_recurrences(
        recurrence_interval=recurrence_interval,
        recurrence_period=recurrence_period,
        created_by=user.id
    )
    res = schedule_recurrence.model_dump(mode="json")
    return res


