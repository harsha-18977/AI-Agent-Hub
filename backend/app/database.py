
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://127.0.0.1:27017/"
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "agenthub_db"
)

client = MongoClient(
    MONGO_URL,
    serverSelectionTimeoutMS=5000
)

client.admin.command("ping")

db = client[DATABASE_NAME]

users_collection = db["users"]
conversations_collection = db["conversations"]
settings_collection = db["settings"]

print("MongoDB connected successfully!")
