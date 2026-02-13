
events = [
    "gym", "meeting", "lunch", "study session",
    "doctor appointment", "team sync", "yoga class", "project", "teaching", "class", "dinner", "date", "conference", "workshop"
]


# dates = [
#     "tomorrow", "next Monday", "March 5", "July 20", "this Saturday",
#     "next Friday", "December 12", "next week", "April 1", "June 15", "August 30", "September 10", "October 25"
# ]

this_next_upcoming = [
    "this", "next", "upcoming", "following", ""
]

day_week_month = [
    "day", "week", "month"
]

recurrence_expr = [
    "every", "each", "evry", "per"
]

day_name = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

month_name = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

print(f"{this_next_upcoming}")

# def get_random_date():
    # rng = random.Random().randint(0,1)
    # if(rng > 0.75):
    #     # time expression kyk tomorrow, next week
    #     return random.choice(recurrences)
    # elif(rng > 0.50):
    #     # expression kyk this monday, this friday, next wednesday
    #     return random.choice(day_pre_modifier) + " " + random.choice(day_name)
    # elif(rng > 0.25):
    #     # expression kyk every monday, every friday, every wednesday
    #     return random.choice(day_name) + " " + random.choice(recurrence_expr) + " " + str(rng.randint(2,10)) + " " + random.choice(time_quantifier)
    # else:
    #     return random.choice(month_name) + " " + str(rng.randint(1, 31))

# recurrences = [
#     "every Monday", "every Friday",
#     "weekly", "every Wednesday"
# ]

# start_times = ["7pm", "10am", "3pm", "6am", "9am"]
# end_times = ["8pm", "12pm", "5pm", "7am", "11am"]
# durations = ["1 hour", "2 hours", "30 minutes"]

# def create_sample():
#     event = random.choice(events)
#     date = random.choice(dates)
#     start = random.choice(start_times)

#     sentence = f"Schedule {event} {date} at {start}"
    
#     entities = []
#     entities.append([9, 9 + len(event), "EVENT"])
    
#     date_start = sentence.find(date)
#     entities.append([date_start, date_start + len(date), "DATE"])
    
#     time_start = sentence.find(start)
#     entities.append([time_start, time_start + len(start), "START_TIME"])
    
#     return [sentence, {"entities": entities}]

# training_data = [create_sample() for _ in range(20)]

# for item in training_data:
#     print(item)
