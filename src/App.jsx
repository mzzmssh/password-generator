import { useState } from "react";
import "./App.css";

export default function App() {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    let characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (includeNumbers) {
      characters += "0123456789";
    }

    if (includeSymbols) {
      characters += "!@#$%^&*()_+";
    }

    let newPassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);

      newPassword += characters[randomIndex];
    }

    setPassword(newPassword);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied!");
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Password Generator</h1>

        <label className="label">
          Password Length: {length}
        </label>

        <input
          type="range"
          min="6"
          max="30"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            />
            Include Numbers
          </label>

          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
            />
            Include Symbols
          </label>
        </div>

        <button className="generate-btn" onClick={generatePassword}>
          Generate Password
        </button>

        {password && (
          <>
            <input
              className="password-box"
              type="text"
              value={password}
              readOnly
            />

            <button className="copy-btn" onClick={copyPassword}>
              Copy Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}