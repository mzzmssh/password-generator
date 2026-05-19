// App.test.jsx
import { render, screen } from '@testing-library/react'
import App from './App'

describe('Password Generator', () => {
  test('renders title', () => {
    render(<App />)
    expect(screen.getByText(/password generator/i)).toBeInTheDocument()
  })

  test('generate button exists', () => {
    render(<App />)
    // Use getAllByText if multiple are expected, or fix the double-render root cause
    expect(screen.getAllByText('Generate Password')[0]).toBeInTheDocument()
  })
})