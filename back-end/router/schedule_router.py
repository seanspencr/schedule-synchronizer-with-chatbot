from fastapi import APIRouter

print("schedule router loaded")
router = APIRouter()

@router.get("/schedule/", tags=["schedule"])
def get_schedule():
    return [{"day": "Monday", "activity": "Gym"}, {"day": "Tuesday", "activity": "Study"}]