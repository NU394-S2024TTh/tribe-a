import Tabs from '../components/charts/ChartTabNav';
import { TEST_DATA } from '../components/charts/testdata';
import ReviewsInput from '../components/reviews/ReviewsInput';
import ShowList from './Showlist';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SentimentAnalysis from './Showlist';


export default function Home() {
	return (
		<Router>
      <ShowList streamingservice="Paramount+"/>
    </Router>
		
	);
}
