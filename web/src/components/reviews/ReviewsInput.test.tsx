import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewsInput from './ReviewsInput';
import sentimentAnalyzer from '../../processes/SentimentAnalyzer.mjs';

// Mock the sentimentAnalyzer
vi.mock('../../processes/SentimentAnalyzer.mjs', () => ({
  getSentiments: vi.fn().mockResolvedValue(['Positive', 'Negative']),
}));

describe('ReviewsInput Component', () => {
  

  it('should split reviews by new line on submit', async () => {
    render(<ReviewsInput />);
    const textarea = screen.getByLabelText(/Enter reviews/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.change(textarea, { target: { value: 'Great product!\nNot good.' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sentimentAnalyzer.getSentiments).toHaveBeenCalledWith(['Great product!', 'Not good.']);
    });
  });

  it('should display alerts with sentiment analysis results', async () => {
    window.alert = vi.fn();
    render(<ReviewsInput />);
    const textarea = screen.getByLabelText(/Enter reviews/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.change(textarea, { target: { value: 'Great product!\nNot good.' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Review: Great product!\nSentiment: Positive');
      expect(window.alert).toHaveBeenCalledWith('Review: Not good.\nSentiment: Negative');
    });
  });
});
