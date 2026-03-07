import { useState } from "react";
import ChatBox from "./Chatbox";
import CodeRunner from "./CodeRunner";
import "./App.css";

function App() {
  const [runnerCode, setRunnerCode] = useState(null);

  return (
    <div className="app-layout">
      <div className="panel-left">
        <ChatBox onSendToRunner={(code, lang) => setRunnerCode({ code, lang })} />
      </div>
      <div className="panel-divider" />
      <div className="panel-right">
        <CodeRunner injectedCode={runnerCode} />
      </div>
    </div>
  );
}

export default App;
