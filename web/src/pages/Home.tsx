import Tabs from '../components/Chart/charttabnav';
import ReviewsInput from '../components/ReviewsInput/reviewsinput';
import { TEST_DATA } from '../components/Chart/testdata';

export default function Home() {
	return (
		<div>
			<ReviewsInput />
			<Tabs data={TEST_DATA}></Tabs>
		</div>
	);
}
