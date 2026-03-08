import React, { useState, useCallback } from 'react';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getStrength(password) {
  if (!password.length) return { level: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return { level: Math.min(score, 5), label: levels[score] };
}

export default function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = '';
    if (uppercase) pool += UPPERCASE;
    if (lowercase) pool += LOWERCASE;
    if (numbers) pool += NUMBERS;
    if (symbols) pool += SYMBOLS;
    if (!pool) {
      setPassword('');
      return;
    }
    const arr = crypto.getRandomValues(new Uint32Array(length));
    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool[arr[i] % pool.length];
    }
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copy = useCallback(() => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [password]);

  const strength = getStrength(password);

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <div className="lock-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1>Password Generator</h1>
          <p className="subtitle">Create a strong, random password</p>
        </header>

        <div className="password-row">
          <output className="password-display" htmlFor="copy-btn" aria-live="polite">
            {password || 'Generate a password'}
          </output>
          <button
            type="button"
            id="copy-btn"
            className="btn btn-copy"
            onClick={copy}
            disabled={!password}
            title="Copy to clipboard"
            aria-label={copied ? 'Copied!' : 'Copy password'}
          >
            {copied ? (
              <span className="copy-text">Copied!</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>

        {password && (
          <div className="strength" role="status" aria-label={`Strength: ${strength.label}`}>
            <div className="strength-bars">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`bar ${i <= strength.level ? `filled s${strength.level}` : ''}`} />
              ))}
            </div>
            <span className="strength-label">{strength.label}</span>
          </div>
        )}

        <div className="options">
          <div className="option">
            <label htmlFor="length">
              <span>Length</span>
              <span className="length-value">{length}</span>
            </label>
            <input
              id="length"
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="checks">
            <label className="check">
              <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
              <span>Uppercase (A–Z)</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
              <span>Lowercase (a–z)</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
              <span>Numbers (0–9)</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
              <span>Symbols (!@#$…)</span>
            </label>
          </div>
        </div>

        <button type="button" className="btn btn-generate" onClick={generate}>
          Generate password
        </button>
      </div>
    </div>
  );
}
