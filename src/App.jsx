import { useState } from "react";
import "./App.css";

export default function App() {
  // --- State ---
  // Stores the desired password length as a number (default 12)
  const [length, setLength] = useState(12);

  // Tracks whether numbers/symbols should be included (both on by default)
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // Holds the generated password — empty string means no password yet
  const [password, setPassword] = useState("");

  // --- Password Generation ---
  const generatePassword = () => {
    // Clamp length between 8 and 30 in the logic itself, not just the UI
    // Math.max enforces the floor (8), Math.min enforces the ceiling (30)
    const safeLength = Math.min(Math.max(Number(length), 8), 30);

    // Define each character set separately so we can guarantee inclusion
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+";

    // Start the pool with letters — always included
    let characters = letters;

    // required holds one guaranteed character per selected type
    // This ensures the password always contains a number/symbol if the user asked for one
    const required = [];

    if (includeNumbers) {
      characters += numbers; // add numbers to the random pool
      // Pick one number directly and reserve it
      required.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }

    if (includeSymbols) {
      characters += symbols; // add symbols to the random pool
      // Pick one symbol directly and reserve it
      required.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    // Fill the remaining slots (total length minus the guaranteed characters)
    // with random picks from the full pool
    let newPassword = [];
    for (let i = 0; i < safeLength - required.length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword.push(characters[randomIndex]);
    }

    // Merge random characters and guaranteed required characters into one array
    newPassword = [...newPassword, ...required];

    // Fisher-Yates shuffle — walks backwards through the array, swapping each
    // element with a randomly chosen earlier element
    // This ensures required characters don't always appear at the end
    for (let i = newPassword.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Destructuring swap — no temporary variable needed
      [newPassword[i], newPassword[j]] = [newPassword[j], newPassword[i]];
    }

    // Join the array into a string and save it to state
    setPassword(newPassword.join(""));
  };

  // --- Clipboard ---
  const copyPassword = () => {
    // writeText returns a Promise — the browser needs to check permissions first
    // .then() runs if the copy succeeds, .catch() runs if it fails
    // Without .catch(), a failure would silently do nothing
    navigator.clipboard.writeText(password)
      .then(() => {
        alert("Password copied!");
      })
      .catch(() => {
        alert("Failed to copy password. Please copy it manually.");
      });
  };

  // --- Render ---
  return (
    <div className="container">
      <div className="card">
        <h1>Password Generator</h1>

        {/* Shows the current slider value next to the label */}
        <label className="label">
          Password Length: {length}
        </label>

        {/* Controlled input — React manages the value via state
            Number() converts the string from e.target.value to a number explicitly */}
        <input
          type="range"
          min="8"
          max="30"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />

        <div className="checkbox-group">
          <label>
            {/* Functional update pattern: prev => !prev reads the latest state value
                rather than the snapshot captured at the last render */}
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

        {/* Short-circuit rendering — password is an empty string by default,
            which is falsy, so nothing renders until a password is generated */}
        {password && (
          <>
            {/* readOnly prevents the user editing the field directly */}
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