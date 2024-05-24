import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewsInput from './ReviewsInput';
import '@testing-library/jest-dom';

describe('ReviewsInput component', () => {
  test('renders the input and submit button', () => {
    render(<ReviewsInput />);
    expect(screen.getByLabelText("Enter reviews:")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('updates the input value on change', () => {
    render(<ReviewsInput />);
    const textarea = screen.getByLabelText("Enter reviews:");
    
    fireEvent.change(textarea, { target: { value: 'Great product!' } });
    expect(textarea).toHaveValue('Great product!');
  });
});
