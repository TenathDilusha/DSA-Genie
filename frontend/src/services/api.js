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

export async function streamMessage(question, onToken, onDone, onError) {
  try {
    const response = await fetch(`${BASE_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question }),
    });
    if (!response.ok) throw new Error("Stream request failed");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      for (const line of text.split("\n")) {
        if (line.startsWith("data: ")) {
          const raw = line.slice(6);
          if (raw === "[DONE]") { onDone(); return; }
          try {
            onToken(JSON.parse(raw));
          } catch {
            onToken(raw);
          }
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err);
  }
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
