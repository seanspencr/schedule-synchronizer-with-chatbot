from repository import user_repository
from database.database_model import Users 
from lib.auth import hash_password, check_password
repository = user_repository

def create_user(username: str, password : str):
    user = Users(username=username, password=hash_password(password))
    return repository.create_user(user)   

def get_all_users() -> list[Users]:
    return repository.get_all_users()

def login(username: str, password: str) -> Users | None:
    # This is just a dummy implementation. You should replace it with actual authentication logic.
    user : Users = repository.find_one_by_username(username)
    print("User found in database:", user)
    if user and check_password(password, user.password):
        return user
    else :
        return None
