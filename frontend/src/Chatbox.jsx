import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { streamMessage } from "./services/api";
import { Send, Bot, User, Copy, Check, Loader2, Sparkles, ArrowRightToLine } from "lucide-react";

const RUNNABLE = new Set(["python", "python3", "javascript", "js"]);

/* ── Inline code block with run button ── */
function CodeBlock({ inline, className, children, onSendToRunner, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : null;
  const code = String(children).replace(/\n$/, "");

  if (inline || !lang) {
    return <code className="inline-code" {...props}>{children}</code>;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang-badge">{lang}</span>
        <div className="code-block-actions">
          <button className="code-action-btn" onClick={handleCopy} title="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {RUNNABLE.has(lang) && (
            <button
              className="code-action-btn send-to-runner"
              onClick={() => onSendToRunner?.(code, lang)}
              title="Open in Code Runner"
            >
              <ArrowRightToLine size={14} />
            </button>
          )}
        </div>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={lang}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: "0 0 8px 8px", fontSize: "13px" }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── Main Chat Component ── */
export default function ChatBox({ onSendToRunner }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm **DSA Genie** — your Data Structures & Algorithms assistant.\n\nAsk me anything about DSA concepts, algorithms, or coding problems!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    streamMessage(
      question,
      (token) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, text: last.text + token };
          return updated;
        });
      },
      () => setLoading(false),
      () => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: "⚠️ Error connecting to server. Make sure the backend is running on port 8000.",
          };
          return updated;
        });
        setLoading(false);
      }
    );
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-panel">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar bot-avatar-header">
            <Sparkles size={18} />
          </div>
          <div>
            <h2>DSA Genie</h2>
            <span className="status-text">
              {loading ? "Thinking..." : "Online"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.map((msg, idx) => {
          if (msg.sender === "bot" && msg.text === "") return null;
          const isBot = msg.sender === "bot";
          return (
            <div key={idx} className={`message-row ${msg.sender}`}>
              <div className={`avatar ${msg.sender}-avatar`}>
                {isBot ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`message-bubble ${msg.sender}`}>
                {isBot ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: (props) => <CodeBlock {...props} onSendToRunner={onSendToRunner} />,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
                <span className="msg-time">{formatTime()}</span>
              </div>
            </div>
          );
        })}

        {loading && messages[messages.length - 1]?.text === "" && (
          <div className="message-row bot">
            <div className="avatar bot-avatar">
              <Bot size={18} />
            </div>
            <div className="message-bubble bot typing-indicator">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            placeholder="Ask a DSA question..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Responses include runnable code examples</p>
      </div>
    </div>
  );
}
