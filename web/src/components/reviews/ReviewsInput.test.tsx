import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import ReviewsInput from './ReviewsInput';

vi.mock('../../processes/SentimentAnalyzer.mjs', () => {
	// Define the mocked implementation for the module's exports
	return {
		default: {
			getSentiments: vi.fn(),
		},
	};
});

test('renders without crashing', () => {
	render(<ReviewsInput />);
	const textarea = screen.getByLabelText('Enter reviews:');
	expect(textarea).toBeTruthy();
	const submitButton = screen.getByText('Submit');
	expect(submitButton).toBeTruthy();
});

test('changes input state when text is entered', async () => {
	render(<ReviewsInput />);
	const textarea = screen.getByLabelText('Enter reviews:') as HTMLTextAreaElement;
	fireEvent.change(textarea, { target: { value: 'Test review' } });
	await waitFor(() => {
		expect(textarea.value).toBe('Test review');
	});
});
