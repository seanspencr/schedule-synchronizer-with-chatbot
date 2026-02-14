import spacy
from spacy.tokens import DocBin
import random
from tqdm import tqdm # Optional, for progress bar

# Activity and Intent expansions
intents = [
    "make me a schedule for", "set a reminder for", "plan a", "schedule a", "remind me to go to", 
    "I need a plan for", "please add", "put on my calendar", "arrange a",
    "book a slot for", "mark down", "create an event for", "save a date for", "don't let me forget",
    "reserve time for", "remind me about",
    "add to agenda:", "new appointment:", "reminder:", "task:",
    "can you schedule", "i have a", "going to", "attending", "need to do", "add", "plan", "schedule", "insert", "input", "put", "set", "arrange", "book", "mark", "create", "save", "reserve", "don't forget",
    "", "","","","","","","","" # Empty string for direct statements like "Gym tomorrow at 5"
]

activities = [
    # --- FITNESS & WELLNESS ---
    "gym", "yoga session", "pilates class", "crossfit", "swimming", 
    "morning run", "weightlifting", "meditation", "cardio workout", "cycling", 
    "spinning class", "martial arts", "boxing practice", "stretching routine", "HIIT workout", 
    "rock climbing", "zumba", "aerobics", "marathon training", "deep breathing exercises",
    "leg day", "upper body workout", "jogging", "power walking", "tai chi", 
    "kickboxing", "jiu-jitsu", "sauna session", "physiotherapy", "chiropractor visit",
    "massage therapy", "acupuncture", "mindfulness session", "recovery session", "spa day",
    "tennis match", "badminton", "squash game", "basketball practice", "soccer training",
    
    # --- WORK & PROFESSIONAL ---
    "coding", "standup meeting", "client call", "project review", "brainstorming session", 
    "email management", "networking event", "performance review", "deep work block", "presentation prep", 
    "team lunch", "job interview", "report writing", "board meeting", "staff training", 
    "budget planning", "sales pitch", "webinar", "conference call", "app deployment",
    "quarterly planning", "1-on-1 with manager", "team sync", "code review", "debugging session",
    "product launch", "marketing strategy meeting", "shareholder meeting", "investor call", "scrum meeting",
    "sprint planning", "retrospective", "design review", "ux research", "legal consultation",
    "contract signing", "business trip", "workshop facilitation", "mentorship session", "exit interview", "teaching"
    
    # --- CREATIVE & HOBBIES ---
    "piano practice", "guitar lessons", "oil painting", "pottery class", "photography walk", 
    "gardening", "creative writing", "knitting", "woodworking", "baking", 
    "podcast recording", "vlogging", "sketching", "dance rehearsal", "choir practice", 
    "chess club", "scrapbooking", "calligraphy", "jewelry making", "bird watching",
    "drum lesson", "vocal training", "acting class", "improv comedy", "magic trick practice",
    "origami", "flower arranging", "coding side project", "blogging", "video editing",
    "mixing music", "dj practice", "poetry reading", "model building", "restoring furniture",
    
    # --- HOUSEHOLD & ERRANDS ---
    "grocery shopping", "laundry", "house cleaning", "meal prep", "car wash", 
    "lawn mowing", "vet appointment", "dentist visit", "therapy session", "hair cut", 
    "dry cleaning pickup", "banking", "post office run", "hardware store trip", "pharmacy visit", 
    "trash collection", "window washing", "dog walking", "apartment hunting", "car maintenance",
    "paying bills", "budget review", "tax preparation", "decluttering", "organizing pantry",
    "watering plants", "checking mail", "repairman visit", "plumber appointment", "electrician visit",
    "oil change", "tire rotation", "inspecting roof", "cleaning gutters", "shoveling snow",
    "grocery delivery", "furniture assembly", "home decor shopping", "buying gifts", "returning items",
    
    # --- EDUCATION & SOCIAL ---
    "math tutoring", "Spanish class", "history lecture", "study group", "library visit", 
    "coding bootcamp", "book club", "dinner date", "brunch with friends", "movie night", 
    "board game night", "volunteering", "museum trip", "concert", "wedding rehearsal", 
    "family reunion", "birthday party", "hiking trip", "beach day", "camping",
    "physics lab", "chemistry experiment", "thesis defense", "graduation ceremony", "alumni event",
    "parent-teacher conference", "school play", "talent show", "science fair", "debate club",
    "coffee catch-up", "pub trivia", "karaoke night", "escape room", "road trip",
    "festival", "art gallery opening", "charity gala", "fundraiser", "blind date", "class"
    
    # --- DAILY LIFE & MISC ---
    "commute", "breakfast", "lunch break", "afternoon snack", "dinner",
    "picking up kids", "dropping off kids", "walking the dog", "feeding the cat", "nap",
    "reading news", "social media break", "checking stocks", "booking flight", "packing luggage",
    "charge car", "fill gas", "buy coffee", "quick shower", "get ready", "chore", "mop the floor", "vacuum", "dust", "take out trash", "recycle", "organize closet",
    "meet friends", "call parents", "video chat with sibling", "family dinner", "date night", "self-care time", "relax", "watch TV", "play video games", "go for a walk",
    "read a book", "listen to music", "meditate", "journal", "plann week", "reflect on day", "sett goals", "budget", "pay bills", "check calendar"
]

# --- TIME & DATE VARIATIONS ---

this_next_upcoming = [
    "this", "next", "upcoming", "following", "the coming", "this coming", 
    "current", "next week's", "future", ""
]

day_week_month = [
    "day", "week", "month", "year", "weekend", "workweek", "quarter", "semester"
]

week_month = [
    "week", "month", "year"
]

recurrence_expr = [
    "every", "each", "evry", "per", "repeating", "recurring", "daily", "weekly", "monthly", "on", "all", "once a"
]

day_name = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
    "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"
]

month_name = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
    "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Sept", "Oct", "Nov", "Dec"
]

# --- CLOCK TIME VARIATIONS ---

times_numeric = [
    "9:00", "10:30", "2", "4:45", "12", "1:00", "3:15", "6:30", "7:45", "8:00",
    "11:15", "12:30", "13:00", "14:00", "15:30", "16:45", "17:00", "18:30",
    "19:00", "20:00", "21:15", "22:30", "23:00", "00:00", "9:05", "10:55",
    "4:20", "11:11", "5:30"
]

times_text = [
    "nine", "ten thirty", "two", "five", "noon", "midnight", "one", "three fifteen",
    "half past six", "quarter to eight", "eight", "eleven", "midday", "one thirty",
    "four forty five", "six", "seven", "quarter past nine", "ten", "three o'clock",
    "five thirty", "six forty-five", "twelve", "eleven thirty"
]

times_vague = [
    "morning", "afternoon", "evening", "tonight", "night", "early morning", 
    "late night", "lunchtime", "dinnertime", "dawn", "dusk", "sunrise", "sunset",
    "mid-morning", "late afternoon", "bedtime", "breakfast time"
]

am_pm = [
    "am", "pm", "a.m.", "p.m.", "AM", "PM", "A.M.", "P.M.", "", "in the morning", 
    "in the afternoon", "in the evening", "at night"
]

# Added Prepositions for Context (Generator logic uses these implicitly or explicitly)
prepositions_start = ["at", "starting at", "beginning at", "around", "from", "circa", "approx"]
prepositions_end = ["to", "until", "ending at", "till", "thru", "-"]


def get_random_time_string():
    """Generates a time string and its type (numeric/text/vague)."""
    type_choice = random.choice(["numeric", "text", "vague"])
    
    if type_choice == "vague":
        return random.choice(times_vague)
    elif type_choice == "text":
        t = random.choice(times_text)
        suffix = f" {random.choice(am_pm)}" if random.random() > 0.5 else ""
        return f"{t}{suffix}".strip()
    else:
        t = random.choice(times_numeric)
        suffix = f" {random.choice(am_pm)}" if random.random() > 0.3 else ""
        return f"{t}{suffix}".strip()

new_label = [
    "EVENT",
    "DATE",
    "START_TIME",
    "END_TIME",
    "RECURRENCE"
]

def make_typo(text, chance=0.2):
    """Randomly introduces typos into a string."""
    if random.random() > chance:
        return text

    # Type 1: Lowercasing (The most common "error")
    if random.random() < 0.5:
        return text.lower()

    # Type 2: Character Swap (e.g., "Monday" -> "Mnday" or "Monady")
    text_list = list(text)
    if len(text_list) > 3:
        idx = random.randint(1, len(text_list) - 2)
        if random.random() > 0.5:
            # Delete a character
            text_list.pop(idx)
        else:
            # Swap adjacent characters
            text_list[idx], text_list[idx+1] = text_list[idx+1], text_list[idx]
            
    return "".join(text_list)


# def generate_variations(n=10):
    training_data = []
    
    numbers = ["2", "3", "4", "two", "three"]
    alternates = ["other", "second"]

    for _ in range(n):
        # 1. Generate the raw text components
        intent = random.choice(intents)
        activity = random.choice(activities)
        
        pattern_type = random.randint(1, 5)
        
        # Determine time string and Label based on pattern
        time_label = "DATE" # Default
        
        if pattern_type == 1: # Recurrence (e.g., "every week on Monday")
            time_str = f"{random.choice(recurrence_expr)} {random.choice(['week', 'month'])} on {random.choice(day_name)}"
            time_label = "RECURRENCE"
        elif pattern_type == 2: # Relative (e.g., "next Monday")
            time_str = f"{random.choice(this_next_upcoming)} {random.choice(day_name)}".strip()
            time_label = "DATE"
        elif pattern_type == 3: # Simple Recurrence (e.g., "every Monday")
            time_str = f"{random.choice(recurrence_expr)} {random.choice(day_name)}"
            time_label = "RECURRENCE"
        elif pattern_type == 4: # Specific Date (e.g., "May 20")
            time_str = f"{random.choice(month_name)} {random.randint(1, 31)}"
            time_label = "DATE"
        else: # Multiplier (e.g., "every 2 weeks")
            num_choice = random.choice([random.choice(numbers), random.choice(alternates)])
            unit = random.choice(['week', 'month', 'day'])
            plural = "s" if unit != "day" and num_choice not in alternates else ""
            time_str = f"every {num_choice} {unit}{plural}"
            time_label = "RECURRENCE"

        # 2. Apply Typos to PARTS (Optional)
        # We apply typos here so we can calculate the correct length afterwards
        # (Assuming make_typo returns the modified string)
        intent = make_typo(intent, chance=0.1) 
        activity = make_typo(activity, chance=0.1)
        time_str = make_typo(time_str, chance=0.1)

        # 3. Construct Sentence & Calculate Indices
        # Structure: "{intent} {activity} {time_str}"
        
        # Start of Activity = length of intent + 1 space
        act_start = len(intent) + 1
        act_end = act_start + len(activity)
        
        # Start of Time = End of activity + 1 space
        time_start = act_end + 1
        time_end = time_start + len(time_str)
        
        full_text = f"{intent} {activity} {time_str}"
        
        # Lowercase everything for consistency (optional)
        full_text = full_text.lower()
        
        # 4. Create the Entity List
        entities = [
            [act_start, act_end, "EVENT"],
            [time_start, time_end, time_label]
        ]
        
        # 5. Add to dataset
        training_data.append(
            (full_text, {'entities': entities})
        )
    
    return training_data


def generate_variations(n=10):
    training_data = []
    
    numbers = ["2", "3", "4", "two", "three"]
    alternates = ["other", "second"]

    for _ in range(n):
        entities = []
        parts = [] # We will build the sentence part by part
        
        # --- PART A: INTENT & ACTIVITY ---
        intent = random.choice(intents)
        activity = random.choice(activities)
        
        # Add Intent (no label usually, but takes up space)
        parts.append(intent)
        
        # Add Activity (Label: EVENT)
        parts.append(activity)
        # We calculate indices later, just store the label for now
        # Format: (text_content, label)
        # We store parts as simple strings, we will handle entities at the end
        
        
        # --- PART B: DATE / RECURRENCE ---
        pattern_type = random.randint(1, 5)
        date_label = "DATE"
        
        if pattern_type == 1: 
            date_str = f"{random.choice(recurrence_expr)} {random.choice(['week', 'month'])} on {random.choice(day_name)}"
            date_label = "RECURRENCE"
        elif pattern_type == 2:
            date_str = f"{random.choice(this_next_upcoming)} {random.choice(day_name)}".strip()
        elif pattern_type == 3:
            date_str = f"{random.choice(recurrence_expr)} {random.choice(day_name)}"
            date_label = "RECURRENCE"
        elif pattern_type == 4:
            date_str = f"{random.choice(month_name)} {random.randint(1, 28)}"
        else:
            num_choice = random.choice([random.choice(numbers), random.choice(alternates)])
            unit = random.choice(['week', 'month', 'day'])
            plural = "s" if unit != "day" and num_choice not in alternates else ""
            date_str = f"every {num_choice} {unit}{plural}"
            date_label = "RECURRENCE"
            
        parts.append(date_str)

        # --- PART C: CLOCK TIME (Start/End) ---
        # 30% chance of no specific time, 40% single start time, 30% range
        time_mode = random.choices(["none", "start_only", "range"], weights=[0.3, 0.4, 0.3])[0]
        
        # Lists to hold the text for the time part specifically
        time_part_str = ""
        time_entities_relative = [] # (start, end, label) relative to the time string

        if time_mode == "start_only":
            t_str = get_random_time_string()
            preposition = random.choice(["at", "around", "in the"]) if t_str in times_vague else "at"
            
            # Construct: "at 5pm"
            time_part_str = f"{preposition} {t_str}"
            
            # Calculate relative index
            # The entity is just the time part, not the preposition
            start_idx = len(preposition) + 1
            end_idx = start_idx + len(t_str)
            time_entities_relative.append((start_idx, end_idx, "START_TIME"))
            
        elif time_mode == "range":
            t_start = get_random_time_string()
            t_end = get_random_time_string()
            
            # Ensure end time is different
            while t_end == t_start:
                t_end = get_random_time_string()
            
            # Decide Pattern: 
            # 1. Spoken Prepositions (from...to / at...until)
            # 2. Between...and
            # 3. Hyphens (9-5 / 9 - 5)
            
            range_type = random.choices(["preposition", "between", "hyphen"], weights=[0.5, 0.2, 0.3])[0]

            if range_type == "preposition":
                p_start = random.choice(prepositions_start)
                p_end = random.choice(prepositions_end)
                
                time_part_str = f"{p_start} {t_start} {p_end} {t_end}"
                
                # Indices
                s_idx = len(p_start) + 1 
                e_idx = s_idx + len(t_start)
                time_entities_relative.append((s_idx, e_idx, "START_TIME"))
                
                s_idx_2 = e_idx + 1 + len(p_end) + 1
                e_idx_2 = s_idx_2 + len(t_end)
                time_entities_relative.append((s_idx_2, e_idx_2, "END_TIME"))

            elif range_type == "between":
                time_part_str = f"between {t_start} and {t_end}"
                
                s_idx = 8 # len("between ")
                e_idx = s_idx + len(t_start)
                time_entities_relative.append((s_idx, e_idx, "START_TIME"))
                
                s_idx_2 = e_idx + 5 # + len(" and ")
                e_idx_2 = s_idx_2 + len(t_end)
                time_entities_relative.append((s_idx_2, e_idx_2, "END_TIME"))

            else: # HYPHEN PATTERN
                # Randomly decide if we use spaces around hyphen (" - " vs "-")
                separator = " - " if random.random() > 0.5 else "-"
                
                time_part_str = f"{t_start}{separator}{t_end}"
                
                # Start Time is at the very beginning (index 0 relative to time_part_str)
                s_idx = 0
                e_idx = len(t_start)
                time_entities_relative.append((s_idx, e_idx, "START_TIME"))
                
                # End Time starts after start_time + separator
                s_idx_2 = e_idx + len(separator)
                e_idx_2 = s_idx_2 + len(t_end)
                time_entities_relative.append((s_idx_2, e_idx_2, "END_TIME"))

        if time_part_str:
            parts.append(time_part_str)

        # --- 4. ASSEMBLE & CALCULATE GLOBAL INDICES ---
        full_text = ""
        final_entities = []
        
        # We assume the order: Intent -> Activity -> Date -> Time
        # We iterate through the parts we created
        
        current_idx = 0
        
        # 1. Intent (No label)
        full_text += intent
        current_idx += len(intent)
        
        # Add space
        full_text += " "
        current_idx += 1
        
        # 2. Activity (Label: EVENT)
        start_act = current_idx
        full_text += activity
        end_act = current_idx + len(activity)
        final_entities.append([start_act, end_act, "EVENT"])
        current_idx = end_act
        
        # Add space
        full_text += " "
        current_idx += 1
        
        # 3. Date (Label: DATE or RECURRENCE)
        start_date = current_idx
        full_text += date_str
        end_date = current_idx + len(date_str)
        final_entities.append([start_date, end_date, date_label])
        current_idx = end_date
        
        # 4. Time (Optional)
        if time_part_str:
            full_text += " "
            current_idx += 1
            
            # The relative indices in time_entities_relative need to be shifted by current_idx
            for t_start, t_end, t_label in time_entities_relative:
                final_entities.append([current_idx + t_start, current_idx + t_end, t_label])
            
            full_text += time_part_str
            
        # Lowercase text (optional, but good for normalization)
        # Note: If you lowercase, ensure indices didn't change (usually fine in English)
        # To be safe, we just return mixed case or ensure logic handles it.
        # Here we return mixed case as generated.
            
        training_data.append([full_text, {'entities': final_entities}])

    return training_data

for data in generate_variations():
    print(data)
    
    
def convert_to_spacy_binary(data, output_file):
    print(f"Converting {len(data)} items to {output_file}...")
    
    # Create a blank English model (only the tokenizer is needed)
    nlp = spacy.blank("en") 
    db = DocBin() 
    
    skipped_count = 0

    for text, annot in tqdm(data):
        doc = nlp.make_doc(text) # Create a Doc object
        ents = []
        
        for start, end, label in annot["entities"]:
            # doc.char_span() maps char indices to token indices
            # alignment_mode="strict" ensures we don't snap to partial tokens
            span = doc.char_span(start, end, label=label, alignment_mode="contract")
            
            if span is None:
                # This happens if the indices cut through the middle of a word
                # or point to whitespace.
                # print(f"Skipping entity: {label} in '{text}' at [{start}:{end}]")
                skipped_count += 1
            else:
                ents.append(span)
        
        # Filter overlapping spans (spaCy doesn't allow overlaps)
        try:
            doc.ents = spacy.util.filter_spans(ents)
            db.add(doc)
        except Exception as e:
            print(f"Error adding doc: {e}")

    # Save to disk
    db.to_disk(output_file)
    print(f"Saved to {output_file}")
    if skipped_count > 0:
        print(f"Warning: Skipped {skipped_count} invalid entities.")
        
        
if __name__ == "__main__":
    # 1. Generate Data
    WHOLE_SIZE = 1000000
    TRAIN_SIZE = int(WHOLE_SIZE * 0.8)
    DEV_SIZE = int(WHOLE_SIZE * 0.2)
    
    train_data = generate_variations(TRAIN_SIZE)
    dev_data = generate_variations(DEV_SIZE) # Always good to have a validation set
    
    # 2. Export
    convert_to_spacy_binary(train_data, "./train.spacy")
    convert_to_spacy_binary(dev_data, "./dev.spacy")
    
    # 3. Validation
    # Let's load it back to make sure it works
    print("\n--- Validation Check ---")
    doc_bin = DocBin().from_disk("./train.spacy")
    nlp = spacy.blank("en")
    docs = list(doc_bin.get_docs(nlp.vocab))
    print(f"Successfully loaded {len(docs)} docs from ./train.spacy")
    print(f"Example: {docs[0].text}")
    print(f"Entities: {[(ent.text, ent.label_) for ent in docs[0].ents]}")