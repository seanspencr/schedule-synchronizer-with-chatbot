from repository import user_repository

repository = user_repository

def create_user(name: str):
    return repository.create_user(name)    