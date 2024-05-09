import Tabs from '../components/charts/ChartTabNav';
import { TEST_DATA } from '../components/charts/testdata';
import ReviewsInput from '../components/reviews/ReviewsInput';

export default function Home() {
	return (
		<div className="flex h-screen flex-row items-center justify-center bg-[#132a3a]">
			<div className="mt-10 mr-20">
				<ReviewsInput />
			</div>
			<div className="mt-10">
				<Tabs data={TEST_DATA}></Tabs>
			</div>
		</div>
	);
}
