import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import App from './components/Spike/App';
import Home from './pages/Home';

// https://github.com/recharts/recharts/issues/2268#issuecomment-1129412873
// https://jskim1991.medium.com/react-writing-tests-with-graphs-9b7f2c9eeefc
// https://github.com/recharts/recharts/issues/2982
// Mock the ResponsiveContainer of recharts module
// https://vitest.dev/guide/mocking.html#modules
// vi.mock('recharts', async (importOriginal) => {
//   const OriginalRechartsModule: any = await importOriginal();
// 	console.log('OriginalRechartsModule', OriginalRechartsModule);

// 	// Define the mock component
// 	const MockResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
//     // <div className="recharts-responsive-container" style={{ width: 800, height: 600 }}>
//     //   {children}
//     // </div>
// 		<OriginalRechartsModule.ResponsiveContainer width={800} height={800}>
// 			{children}
// 		</OriginalRechartsModule.ResponsiveContainer>
//   );

//   // Return the original module with the ResponsiveContainer mocked
//   return {
//     ...(OriginalRechartsModule as { [key: string]: any }),  // type assertion to tell TypeScript that OriginalRechartsModule is an object
//     ResponsiveContainer: MockResponsiveContainer,
//   };
// });

describe('Spike tests', () => {
	test('Tribe A Members should appear', () => {
		render(<App />);
		expect(screen.getByText('Tribe A Members')).toBeDefined();
	});
});

describe('Home screen tests', () => {
	test('Sentiment Analysis should appear', () => {
		render(<Home />);
		expect(screen.getByText('Sentiment Analysis')).toBeDefined();
	});
	test('A line graph with value 0.0 should appear', () => {
		render(<Home />);
		expect(screen.getByText('0.0')).toBeDefined();
	});
	// test('A graph with text IMDb should appear when Sentiment Analysis is clicked', async () => {
	// 	render(<Home />);
	// 	const button = screen.getByText('Sentiment Analysis');
	// 	await fireEvent.click(button);

	// 	// wait for 3 seconds for the graph to appear manually in the browser
	// 	await waitFor(() => {expect(screen.getByText('IMDb')).toBeDefined() }, { timeout: 3000 });
	// });
});
