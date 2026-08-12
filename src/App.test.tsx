import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing and shows the Home page by default', () => {
    // We wrap App inside memory router internally, but App already has BrowserRouter
    // Since App has BrowserRouter, we shouldn't wrap it in MemoryRouter.
    render(<App />);
    
    // Verificando se o título inicial "Educa.bolsa" está na tela
    const titleElements = screen.getAllByText(/Educa.bolsa/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });
});
