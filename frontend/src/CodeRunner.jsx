import { useState, useEffect } from "react";
import { Play, RotateCcw, ChevronDown, Terminal, Loader2 } from "lucide-react";
import { executeCode } from "./services/api";

const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
];

const LANG_MAP = {
  python: "python",
  python3: "python",
  py: "python",
  javascript: "javascript",
  js: "javascript",
};

const TEMPLATES = {
  python: `# Write your code here\nprint("Hello, DSA Genie!")`,
  javascript: `// Write your code here\nconsole.log("Hello, DSA Genie!");`,
};

export default function CodeRunner({ injectedCode }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(TEMPLATES.python);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState(false);

  // Accept code from chat code blocks
  useEffect(() => {
    if (!injectedCode) return;
    const mappedLang = LANG_MAP[injectedCode.lang?.toLowerCase()] || "python";
    setLanguage(mappedLang);
    setCode(injectedCode.code);
    setOutput(null);
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 800);
    return () => clearTimeout(t);
  }, [injectedCode]);

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(TEMPLATES[lang]);
    setOutput(null);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await executeCode(language, code);
      setOutput(res);
    } catch {
      setOutput({ success: false, output: "Failed to reach execution server.", exit_code: -1 });
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setCode(TEMPLATES[language]);
    setOutput(null);
  };

  return (
    <div className={`code-runner-panel ${flash ? "flash" : ""}`}>
      <div className="runner-header">
        <div className="runner-title">
          <Terminal size={18} />
          <span>Code Playground</span>
        </div>
        <div className="runner-controls">
          <div className="lang-select-wrapper">
            <select value={language} onChange={handleLangChange}>
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
          <button className="icon-btn reset-btn" onClick={handleReset} title="Reset code">
            <RotateCcw size={15} />
          </button>
          <button
            className={`run-code-btn ${running ? "running" : ""}`}
            onClick={handleRun}
            disabled={running}
          >
            {running ? <Loader2 size={15} className="spin" /> : <Play size={15} />}
            <span>{running ? "Running…" : "Run"}</span>
          </button>
        </div>
      </div>

      <div className="editor-area">
        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder="Write your code here..."
        />
      </div>

      <div className="output-area">
        <div className="output-header">
          <Terminal size={14} />
          <span>Output</span>
        </div>
        <div className={`output-content ${output ? (output.success ? "success" : "error") : ""}`}>
          {output ? (
            <pre>{output.output}</pre>
          ) : (
            <span className="output-placeholder">Run your code to see output here...</span>
          )}
        </div>
      </div>
    </div>
  );
}
