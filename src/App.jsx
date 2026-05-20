import { useState } from "react";
import "./App.css";

export default function App() {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    // FIX 3: Validate length is within expected bounds
    const safeLength = Math.min(Math.max(Number(length), 6), 30);

    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+";

    let characters = letters;
    // FIX 2: Build the required characters array to guarantee inclusion
    const required = [];

    if (includeNumbers) {
      characters += numbers;
      required.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }

    if (includeSymbols) {
      characters += symbols;
      required.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    // Fill remaining slots randomly from the full pool
    let newPassword = [];
    for (let i = 0; i < safeLength - required.length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword.push(characters[randomIndex]);
    }

    // Add the guaranteed required characters, then shuffle
    newPassword = [...newPassword, ...required];
    for (let i = newPassword.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPassword[i], newPassword[j]] = [newPassword[j], newPassword[i]];
    }

    setPassword(newPassword.join(""));
  };

  const copyPassword = () => {
    // FIX 4: Handle clipboard success and failure properly
    navigator.clipboard.writeText(password)
      .then(() => {
        alert("Password copied!");
      })
      .catch(() => {
        alert("Failed to copy password. Please copy it manually.");
      });
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Password Generator</h1>

        <label className="label">
          Password Length: {length}
        </label>

        {/* FIX 1: Convert slider value to Number explicitly */}
        <input
          type="range"
          min="6"
          max="30"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />

        <div className="checkbox-group">
          <label>
            {/* FIX 5: Use functional update pattern for state toggles */}
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(prev => !prev)}
            />
            Include Numbers
          </label>

          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(prev => !prev)}
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