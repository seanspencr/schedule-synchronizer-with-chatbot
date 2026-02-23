from database import db_connection
from supabase import Client
from database.database_model import Schedules, ScheduleRecurrences

connection : Client = db_connection.supabase

def get_all_schedules_by_user_id(user_id : str) -> list[Schedules]:
    schedule_list = connection.table("schedules").select("*").eq("created_by", user_id).execute().data
    return [Schedules(**schedule) for schedule in schedule_list]

def create_schedule(schedule: Schedules) -> Schedules:
    print("Creating schedule with event:", schedule.event)
    data_for_db = schedule.model_dump(mode="json") 
    
    response = connection.table("schedules").insert(json=data_for_db).execute()
    return Schedules(**response.data[0])

def create_schedule_recurrences(schedule_recurrence : ScheduleRecurrences):
    data_for_db = schedule_recurrence.model_dump(mode="json")
    response = connection.table("schedule_recurrences").insert(json=data_for_db).execute()
    return ScheduleRecurrences(**response.data[0])