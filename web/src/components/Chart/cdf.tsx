import { reviewitem } from './charttabnav';
export function cdfcalc(data: reviewitem[]): reviewitem[] {
	// Initialize an object to store the counts of each number
	const countMap: Record<number, number> = {};

	// Count the occurrences of each number
	for (const item of data) {
		countMap[item.number] = (countMap[item.number] || 0) + 1;
	}

	// Construct the result in the desired format
	const result: reviewitem[] = Object.keys(countMap).map((key) => ({
		name: key,
		number: countMap[parseInt(key)],
	}));

	return result;
}

export function numsorter(data: reviewitem[]): reviewitem[] {
	return data.sort((a, b) => a.number - b.number);
}
