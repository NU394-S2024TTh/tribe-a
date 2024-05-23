import { render, screen } from '@testing-library/react';
import AreaGraph from './AreaGraph';
import '@testing-library/jest-dom';

describe('AreaGraph component', () => {
  test('renders correct content when empty prop is true', () => {
    render(<AreaGraph receivedData={[]} empty={true} />);
    expect(screen.getByText("Sorry,")).toBeInTheDocument();
    expect(screen.getByText("There`s no data.")).toBeInTheDocument();
  });

  test('renders correct content when empty prop is false', () => {
    const mockData = [
      { name: 'Test', number: 5 },
      { name: 'Test2', number: 10 },
    ];
    render(<AreaGraph receivedData={mockData} empty={false} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Test2")).toBeInTheDocument();
  });
});
