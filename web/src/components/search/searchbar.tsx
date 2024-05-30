/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	ChangeEvent,
	Dispatch,
	KeyboardEvent,
	SetStateAction,
	useState,
} from 'react';

import { getReviews, type Review } from '../../firebase/firebasefunctions';
import type { Show } from '../../pages/Showlist';
type SearchBarProps = {
	onSearch: (data: any) => void;
	setName: (show: Show | null) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, setName }) => {
	const [query, setQuery] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			console.log(query);
			try {
				const reviews: Review[] = await getReviews(query);
				const reviews_data = reviews.map((review: any) => ({
					sentiment: review.rating,
					created: review.created,
				}));
				onSearch(reviews_data);
				const newShow: Show = {
					name: query,
				};
				setName(newShow);
			} catch (error: any) {
				console.error('Failed to loadreviews:', error);
			}
		}
	};

	return (
		<div>
			<input
				type="text"
				value={query}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder="Search..."
				className="min-w-[10vw] rounded-lg"
			/>
		</div>
	);
};

export default SearchBar;
