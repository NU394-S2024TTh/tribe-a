/* eslint-disable @typescript-eslint/no-explicit-any */
import UserCard from './RadixCard';

export interface Members {
	id: number;
	name: string;
	email: string;
	avatar: any;
	team: string;
}
function CardTable() {
	const groupArr: Members[] = [
		{
			id: 1,
			name: 'Chiao-Wei Hsu',
			email: 'chiao-weihsu2025@u.northwestern.edu',
			avatar: '',
			team: 'yellow',
		},
		{
			id: 2,
			name: 'Qinyan Li',
			email: 'qinyanli2024@u.northwestern.edu',
			avatar: '',
			team: 'orange',
		},
		{
			id: 3,
			name: 'Ella Cutler',
			email: 'ellacutler2025@u.northwestern.edu',
			avatar: '',
			team: 'yellow',
		},
		{
			id: 4,
			name: 'Sofia Melendez',
			email: 'SofiaMelendez2025@u.northwestern.edu',
			avatar: '',
			team: 'orange',
		},
		{
			id: 5,
			name: 'Jacky Zhang',
			email: 'jackyzhang2025@u.northwestern.edu',
			avatar: '',
			team: 'yellow',
		},
		{
			id: 6,
			name: 'Alan Wang',
			email: 'alanwang2026@u.northwestern.edu',
			avatar: '',
			team: 'yellow',
		},
		{
			id: 7,
			name: 'Joanna Jung',
			email: 'joannajung2026@u.northwestern.edu',
			avatar: '',
			team: 'orange',
		},
		{
			id: 8,
			name: 'Aru Singh',
			email: 'arusingh2024@u.northwestern.edu',
			avatar: '',
			team: 'yellow',
		},
		{
			id: 9,
			name: 'Mengnan He',
			email: 'mengnanhe2025@u.northwestern.edu',
			avatar: '',
			team: 'orange',
		},
		{
			id: 10,
			name: 'Ethan Guo',
			email: 'ethanguo2026@u.northwestern.edu',
			avatar: '',
			team: 'yellow',
		},
		{
			id: 11,
			name: 'Tina Chen',
			email: 'tinachen2025@u.northwestern.edu',
			avatar: '',
			team: 'orange',
		},
		{
			id: 12,
			name: 'Shawn Liang',
			email: 'shawnliang2024@u.northwestern.edu',
			avatar: '',
			team: 'orange',
		},
	];
	return (
		<div className="App">
			{groupArr.map((person) => (
				<UserCard member={person} key={person.id}></UserCard>
			))}
		</div>
	);
}

export default CardTable;
