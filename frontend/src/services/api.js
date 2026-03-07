const BASE_URL = "http://localhost:8000";

export async function sendMessage(question) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: question }),
  });
  if (!response.ok) throw new Error("Failed to fetch response");
  return response.json();
}

export async function executeCode(language, code) {
  const response = await fetch(`${BASE_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code }),
  });
  if (!response.ok) throw new Error("Execution request failed");
  return response.json();
}
