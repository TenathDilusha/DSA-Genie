import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { sendMessage, executeCode } from "./services/api";

const RUNNABLE = new Set(["python", "python3", "javascript", "js"]);

function CodeBlock({ node, inline, className, children, ...props }) {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : null;
  const code = String(children).replace(/\n$/, "");

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await executeCode(lang, code);
      setOutput(res);
    } catch {
      setOutput({ success: false, output: "Failed to reach execution server.", exit_code: -1 });
    } finally {
      setRunning(false);
    }
  };

  if (inline || !lang) {
    return <code className="inline-code" {...props}>{children}</code>;
  }

  return (
    <div className="code-runner">
      <div className="code-runner-header">
        <span className="lang-badge">{lang}</span>
        {RUNNABLE.has(lang) && (
          <button
            className={`run-btn ${running ? "running" : ""}`}
            onClick={handleRun}
            disabled={running}
          >
            {running ? "Running…" : "▶ Run"}
          </button>
        )}
      </div>
      <SyntaxHighlighter style={oneDark} language={lang} PreTag="div" {...props}>
        {code}
      </SyntaxHighlighter>
      {output && (
        <div className={`code-output ${output.success ? "success" : "error"}`}>
          <div className="output-label">
            {output.success ? "✅ Output" : `❌ Error (exit ${output.exit_code})`}
          </div>
          <pre>{output.output}</pre>
        </div>
      )}
    </div>
  );
}

function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me any DSA question 📘" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(input);
      const botMessage = { sender: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.sender === "bot" ? (
              <ReactMarkdown components={{ code: CodeBlock }}>
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {loading && (
          <div className="message bot thinking">
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask a DSA question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
