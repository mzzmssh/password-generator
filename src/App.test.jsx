import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Password Generator', () => {
  // FIX 2: Use getByRole for a specific, reliable query — no workarounds needed
  test('renders the title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /password generator/i })).toBeInTheDocument();
  });

  test('generate button is present', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /generate password/i })).toBeInTheDocument();
  });

  // FIX 1: Test behaviour — password is generated and displayed when button is clicked
  test('generates and displays a password when the button is clicked', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /generate password/i });
    fireEvent.click(button);
    const passwordInput = screen.getByRole('textbox');
    expect(passwordInput.value.length).toBeGreaterThan(0);
  });

  // FIX 1: Test that the generated password length matches the slider value
  test('generates a password matching the selected length', () => {
    render(<App />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    const passwordInput = screen.getByRole('textbox');
    expect(passwordInput.value.length).toBe(20);
  });

  // FIX 1: Test that numbers are included when checkbox is checked
  test('includes at least one number when Include Numbers is checked', () => {
    render(<App />);
    const numbersCheckbox = screen.getByRole('checkbox', { name: /include numbers/i });
    if (!numbersCheckbox.checked) {
      fireEvent.click(numbersCheckbox);
    }
    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    const passwordInput = screen.getByRole('textbox');
    expect(passwordInput.value).toMatch(/[0-9]/);
  });

  // FIX 1: Test that symbols are included when checkbox is checked
  test('includes at least one symbol when Include Symbols is checked', () => {
    render(<App />);
    const symbolsCheckbox = screen.getByRole('checkbox', { name: /include symbols/i });
    if (!symbolsCheckbox.checked) {
      fireEvent.click(symbolsCheckbox);
    }
    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    const passwordInput = screen.getByRole('textbox');
    expect(passwordInput.value).toMatch(/[!@#$%^&*()_+]/);
  });

  // FIX 1: Test checkbox toggle behaviour
  test('unchecking Include Numbers removes numbers from password pool', () => {
    render(<App />);
    const numbersCheckbox = screen.getByRole('checkbox', { name: /include numbers/i });
    // Ensure it starts checked, then uncheck it
    if (!numbersCheckbox.checked) fireEvent.click(numbersCheckbox);
    fireEvent.click(numbersCheckbox); // uncheck

    // Also uncheck symbols so only letters remain
    const symbolsCheckbox = screen.getByRole('checkbox', { name: /include symbols/i });
    if (symbolsCheckbox.checked) fireEvent.click(symbolsCheckbox);

    fireEvent.click(screen.getByRole('button', { name: /generate password/i }));
    const passwordInput = screen.getByRole('textbox');
    expect(passwordInput.value).not.toMatch(/[0-9]/);
  });
});