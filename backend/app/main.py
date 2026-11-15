
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Any
from pydantic import BaseModel, Field
from typing import Literal
from app.database import settings_collection, users_collection

from app.database import (
    client,
    db,
    conversations_collection
)
from app.auth import (
    router as auth_router,
    get_current_user
)

app = FastAPI(
    title="AI-AgentHub API",
    description="Backend API for AI-AgentHub",
    version="1.0.0"
)

# React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


# Conversation request model
class ConversationRequest(BaseModel):
    sessionId: str = Field(min_length=1, max_length=150)
    agentId: str = Field(min_length=1, max_length=100)
    agentName: str = Field(min_length=1, max_length=150)
    messages: list[dict[str, Any]]
    updatedAt: str | None = None

class SettingsRequest(BaseModel):
    display_name: str = Field(min_length=2, max_length=80)
    theme: Literal["Dark", "Light (Coming Soon)"] = "Dark"
    notifications: bool = True

# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to AI-AgentHub Backend!",
        "status": "Running"
    }


# Health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI-AgentHub API"
    }


# MongoDB health check
@app.get("/health/mongodb")
def mongodb_health():
    try:
        client.admin.command("ping")
        return {
            "status": "connected",
            "database": db.name,
            "message": "MongoDB connection successful"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# Available agents
@app.get("/api/agents")
def get_agents():
    return {
        "agents": [
            {"id": "research", "name": "Research Agent"},
            {"id": "career", "name": "Career Agent"},
            {"id": "email", "name": "Email Agent"},
            {"id": "dataAnalysis", "name": "Data Analysis Agent"}
        ]
    }


# Save or update conversation
@app.post("/api/conversations")
def save_conversation(
    conversation: ConversationRequest,
    current_user: dict = Depends(get_current_user)
):
    now = datetime.now(timezone.utc).isoformat()

    document = {
        "user_id": str(current_user["_id"]),
        "sessionId": conversation.sessionId,
        "agentId": conversation.agentId,
        "agentName": conversation.agentName,
        "messages": conversation.messages,
        "updatedAt": conversation.updatedAt or now
    }

    conversations_collection.update_one(
        {
            "user_id": str(current_user["_id"]),
            "sessionId": conversation.sessionId
        },
        {"$set": document},
        upsert=True
    )

    return {
        "message": "Conversation saved successfully",
        "sessionId": conversation.sessionId
    }


# Get logged-in user's conversations
@app.get("/api/conversations")
def get_conversations(
    current_user: dict = Depends(get_current_user)
):
    conversations = list(
        conversations_collection.find(
            {"user_id": str(current_user["_id"])},
            {"_id": 0}
        ).sort("updatedAt", -1)
    )

    return {"conversations": conversations}


# Delete a conversation belonging to the logged-in user
@app.delete("/api/conversations/{session_id}")
def delete_conversation(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = conversations_collection.delete_one({
        "user_id": str(current_user["_id"]),
        "sessionId": session_id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    return {
        "message": "Conversation deleted successfully"
    }
# Get logged-in user's settings
@app.get("/api/settings")
def get_settings(
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    settings = settings_collection.find_one(
        {"user_id": user_id},
        {"_id": 0}
    )

    return {
        "display_name": (
            settings.get("display_name", current_user["name"])
            if settings else current_user["name"]
        ),
        "email": current_user["email"],
        "theme": settings.get("theme", "Dark") if settings else "Dark",
        "notifications": (
            settings.get("notifications", True)
            if settings else True
        )
    }


# Update logged-in user's settings
@app.put("/api/settings")
def update_settings(
    data: SettingsRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    settings_collection.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "user_id": user_id,
                "display_name": data.display_name.strip(),
                "theme": data.theme,
                "notifications": data.notifications
            }
        },
        upsert=True
    )

    # Update the user's display name in the users collection
    users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"name": data.display_name.strip()}}
    )

    return {
        "message": "Settings updated successfully"
    }


# Clear all conversations of the logged-in user
@app.delete("/api/conversations")
def clear_all_conversations(
    current_user: dict = Depends(get_current_user)
):
    result = conversations_collection.delete_many({
        "user_id": str(current_user["_id"])
    })

    return {
        "message": "Chat history cleared successfully",
        "deleted_count": result.deleted_count
    }