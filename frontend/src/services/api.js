export async function sendMessage(question) {
  const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: question }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch response");
  }

  return response.json();
}
