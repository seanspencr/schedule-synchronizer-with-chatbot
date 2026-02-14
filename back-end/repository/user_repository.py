from database import db_connection
from supabase import Client

connection : Client = db_connection.supabase

def get_all_users():
    return [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"},
        {"id": 3, "name": "Charlie"}
    ]
    
def create_user(name: str):
    print("Creating user with name:", name)
    return connection.table("users").insert(json={"username": name}).execute().data