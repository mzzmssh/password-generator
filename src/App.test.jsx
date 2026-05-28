import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Password Generator', () => {

  // --- Presence tests ---
  // These confirm the basic UI elements exist on the page

  test('renders the title', () => {
    render(<App />);
    // getByRole('heading') targets <h1>–<h6> elements specifically
    // name matches the accessible text content, case-insensitive via the /i flag
    expect(screen.getByRole('heading', { name: /password generator/i })).toBeInTheDocument();
  });

  test('generate button is present', () => {
    render(<App />);
    // getByRole('button') is more reliable than getByText — it confirms
    // the element is actually a button, not just text that looks like one
    expect(screen.getByRole('button', { name: /generate password/i })).toBeInTheDocument();
  });

  // --- Behaviour tests ---
  // These simulate user interactions and assert on the outcome

  test('generates and displays a password when the button is clicked', () => {
    render(<App />);
    // Simulate clicking the generate button
    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    // The password input only appears after generation — getByRole would throw if it's missing
    const passwordInput = screen.getByRole('textbox');
    expect(passwordInput.value.length).toBeGreaterThan(0);
  });

  test('generates a password matching the selected length', () => {
    render(<App />);
    // fireEvent.change simulates moving the slider
    // { target: { value: '20' } } mimics what the browser sends as the event object
    fireEvent.change(screen.getByRole('slider'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    expect(screen.getByRole('textbox').value.length).toBe(20);
  });

  test('includes at least one number when Include Numbers is checked', () => {
    render(<App />);
    const numbersCheckbox = screen.getByRole('checkbox', { name: /include numbers/i });
    // Guard: only click if not already checked — avoids assuming default state
    if (!numbersCheckbox.checked) fireEvent.click(numbersCheckbox);
    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    // toMatch with a regex checks whether the string contains at least one digit
    expect(screen.getByRole('textbox').value).toMatch(/[0-9]/);
  });

  test('includes at least one symbol when Include Symbols is checked', () => {
    render(<App />);
    const symbolsCheckbox = screen.getByRole('checkbox', { name: /include symbols/i });
    if (!symbolsCheckbox.checked) fireEvent.click(symbolsCheckbox);
    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    // Character class matches any one of the listed symbols
    expect(screen.getByRole('textbox').value).toMatch(/[!@#$%^&*()_+]/);
  });

  test('unchecking Include Numbers removes numbers from password pool', () => {
    render(<App />);
    const numbersCheckbox = screen.getByRole('checkbox', { name: /include numbers/i });
    // Ensure it starts checked, then uncheck it
    if (!numbersCheckbox.checked) fireEvent.click(numbersCheckbox);
    fireEvent.click(numbersCheckbox); // uncheck

    // Uncheck symbols too so the password is letters-only — isolates the variable being tested
    const symbolsCheckbox = screen.getByRole('checkbox', { name: /include symbols/i });
    if (symbolsCheckbox.checked) fireEvent.click(symbolsCheckbox);

    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    // not.toMatch asserts the password contains no digits at all
    expect(screen.getByRole('textbox').value).not.toMatch(/[0-9]/);
  });

});