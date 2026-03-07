import { useState } from "react";
import ChatBox from "./Chatbox";
import CodeRunner from "./CodeRunner";
import { MessageSquare, Code2, Sparkles } from "lucide-react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Sparkles size={22} />
          <span>DSA Genie</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            <MessageSquare size={18} />
            <span>Chat</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            <Code2 size={18} />
            <span>Code Runner</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <p>Powered by LLaMA + RAG</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === "chat" ? <ChatBox /> : <CodeRunner />}
      </main>
    </div>
  );
}

export default App;
