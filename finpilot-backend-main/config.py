import os
from dotenv import load_dotenv

load_dotenv()

# In a real app, use os.getenv("FIREBASE_CREDENTIALS_PATH")
# For this hackathon setup, we assume the file is in the root
CREDENTIALS_PATH = "serviceAccountKey.json"