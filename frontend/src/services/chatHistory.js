import API from "./auth";

// Get all conversations belonging to the logged-in user
export async function getChatHistory() {
  const response = await API.get("/api/conversations", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
  });

  return response.data.conversations;
}

// Save or update a conversation
export async function saveChatHistory(conversation) {
  const response = await API.post("/api/conversations", conversation, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
  });

  return response.data;
}

// Delete a conversation
export async function deleteChatHistory(sessionId) {
  const response = await API.delete(
    `/api/conversations/${encodeURIComponent(sessionId)}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    },
  );

  return response.data;
}
