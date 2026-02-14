import os
from dotenv import load_dotenv
from supabase import create_client, Client, ClientOptions
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

print("Supabase URL:", url)
print("Supabase Key:", key)

supabase: Client = create_client(url, key, ClientOptions(schema="calendar_synchronizer") )