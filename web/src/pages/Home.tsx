import Tabs from '../components/Chart/charttabnav';
import { TEST_DATA } from '../components/Chart/testdata';

export default function Home() {
	return (
		<div>
			<Tabs data={TEST_DATA}></Tabs>
		</div>
	);
}
