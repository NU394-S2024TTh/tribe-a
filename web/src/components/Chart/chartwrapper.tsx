import * as React from 'react';
import BarGraph from './graph';
import LiveBarGraph from './livegraph';


// edit this interface to match the fields of the data being passed through
interface DataPoint {
  name: string;
  Rating: number;
}

interface ChartWrapperProps {
  data: DataPoint[];
  title: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ data, title }) => {
  const [analysisType, setAnalysisType] = React.useState<'bar' | 'live'>('bar');

  const handleAnalysisToggle = (type: 'bar' | 'live') => {
    setAnalysisType(type);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-6 text-center text-indigo-600">{title}</h2>
      <div className="flex justify-center mb-5">
        <button
          className={`px-4 py-2 rounded-lg mr-2 ${
            analysisType === 'bar' ? 'bg-indigo-500 text-white' : 'bg-white text-black'
          }`}
          onClick={() => handleAnalysisToggle('bar')}
        >
          Sentiment Analysis
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            analysisType === 'live' ? 'bg-purple-800 text-white' : 'bg-white text-black'
          }`}
          onClick={() => handleAnalysisToggle('live')}
        >
          Trend Analysis
        </button>
      </div>
      {analysisType === 'bar' ? (
        <BarGraph receivedData={data} />
      ) : (
        <LiveBarGraph receivedData={data} empty={data.length === 0} />
      )}
    </div>
  );
};

export default ChartWrapper;