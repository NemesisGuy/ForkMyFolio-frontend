import React from 'react';
import { render, screen } from '@testing-library/react';
import SimpleGreeter from './SimpleGreeter';

describe('SimpleGreeter component', () => {
  test('renders greeting with the provided name', () => {
    render(<SimpleGreeter name="World" />);
    const headingElement = screen.getByText(/Hello, World!/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders greeting with a different name', () => {
    render(<SimpleGreeter name="React" />);
    const headingElement = screen.getByText(/Hello, React!/i);
    expect(headingElement).toBeInTheDocument();
  });
});
