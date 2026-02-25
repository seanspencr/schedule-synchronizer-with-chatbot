from repository import schedule_repository
from database.database_model import ScheduleRecurrences, Users, Schedules 
from lib.auth import hash_password, check_password
import datetime
from utilmodel.recurrence_period import RecurrencePeriod

repository = schedule_repository

def create_schedule(
    event_date: datetime.date,
    start_time: datetime.time,
    end_time: datetime.time,
    event: str,
    user_id: str,
    ):
    
    schedule = Schedules(
        event_date=event_date,
        start_time=start_time,
        end_time=end_time,
        event=event,
        created_by=user_id
    )
    return repository.create_schedule(schedule)

def get_all_schedules_by_user_id(user_id: str) -> list[Schedules]:
    return repository.get_all_schedules_by_user_id(user_id)



def create_schedule_recurrences(
    recurrence_interval : int,
    recurrence_period : str,
    created_by : str
    ):
    if recurrence_period not in RecurrencePeriod.__members__:
        raise ValueError("Invalid recurrence period. Must be one of 'DAY', 'WEEK', 'MONTH', 'YEAR'.")
    recurrence = ScheduleRecurrences(
        recurrence_interval=recurrence_interval,
        recurrence_period=recurrence_period,
        created_by=created_by
        )
    return repository.create_schedule_recurrences(recurrence)

