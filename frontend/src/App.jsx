import ChatBox from "./Chatbox";
import CodeRunner from "./CodeRunner";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <div className="panel-left">
        <ChatBox />
      </div>
      <div className="panel-divider" />
      <div className="panel-right">
        <CodeRunner />
      </div>
    </div>
  );
}

export default App;
