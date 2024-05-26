import { BrowserRouter as Router } from 'react-router-dom';

import ShowList from './Showlist';

export default function Home() {
	return (
		<Router>
			<ShowList streamingservice="Paramount+" />
		</Router>
	);
}
