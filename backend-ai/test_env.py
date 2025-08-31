import os
from dotenv import load_dotenv

load_dotenv() # Tries to find and load the .env file

db_url = os.getenv("DATABASE_URL")

print("--- Testing .env file ---")
if db_url:
    print("✅ SUCCESS: The DATABASE_URL was loaded.")
    # print(f"URL: {db_url}") # Uncomment to see the full URL
else:
    print("❌ FAILED: The DATABASE_URL could not be found.")