import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Loads environment variables from the .env file into the app's environment.
load_dotenv()

# Grab MongoDB URI and database name from environment variables.
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# It's important to check that both are set, otherwise the app can't connect to MongoDB.
if not MONGO_URI or not DATABASE_NAME:
    raise Exception("Missing MONGO_URI or DATABASE_NAME in environment variables!")

# Create the async MongoDB client.
client = AsyncIOMotorClient(MONGO_URI)

# This 'db' object is how the rest of the app will talk to the database.
db = client[DATABASE_NAME]
