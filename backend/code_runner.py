import subprocess
import tempfile
import os
import sys

TIMEOUT = 10  # seconds

LANG_CONFIG = {
    "python": {"cmd": [sys.executable], "ext": ".py"},
    "python3": {"cmd": [sys.executable], "ext": ".py"},
    "javascript": {"cmd": ["node"], "ext": ".js"},
    "js": {"cmd": ["node"], "ext": ".js"},
}

def run_code(language: str, code: str) -> dict:
    lang = language.lower().strip()
    if lang not in LANG_CONFIG:
        supported = ", ".join(sorted(set(LANG_CONFIG.keys())))
        return {
            "success": False,
            "output": f"Unsupported language: '{language}'. Supported: {supported}",
            "exit_code": -1,
        }

    config = LANG_CONFIG[lang]

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=config["ext"], delete=False, encoding="utf-8"
    ) as f:
        f.write(code)
        tmp_path = f.name

    try:
        result = subprocess.run(
            config["cmd"] + [tmp_path],
            capture_output=True,
            text=True,
            timeout=TIMEOUT,
        )
        stdout = result.stdout.strip()
        stderr = result.stderr.strip()
        combined = stdout
        if stderr:
            combined = (stdout + "\n" + stderr).strip()
        return {
            "success": result.returncode == 0,
            "output": combined or "(no output)",
            "exit_code": result.returncode,
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "output": f"Execution timed out after {TIMEOUT}s",
            "exit_code": -1,
        }
    except FileNotFoundError:
        return {
            "success": False,
            "output": f"Runtime for '{language}' not found on this system",
            "exit_code": -1,
        }
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
