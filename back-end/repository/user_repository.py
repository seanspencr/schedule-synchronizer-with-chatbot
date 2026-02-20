from database import db_connection
from supabase import Client
from database.database_model import Users

connection : Client = db_connection.supabase

def get_all_users() -> list[Users]:
    user_list = connection.table("users").select("*").execute().data
    return [Users(**user) for user in user_list]

def create_user(user: Users) -> Users:
    print("Creating user with name:", user.username)
    return Users(**connection.table("users").insert(json=user.dict()).execute().data[0])

def find_one(id: str) -> Users | None:
    result = connection.table("users").select("*").eq("id", id).execute().data
    return Users(**result[0]) if result else None

def find_one_by_username(username: str) -> Users | None:
    result =  connection.table("users").select("*").eq("username", username).execute().data
    return Users(**result[0]) if result else None