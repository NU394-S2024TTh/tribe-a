/* eslint-disable @typescript-eslint/no-unused-vars */
import { reviewitem } from './ChartTabNav';
export function cdfcalc(data: reviewitem[], numBins: number): reviewitem[] {
	const counts: number[] = Array(numBins).fill(0);
	const binSize = 5 / numBins;

	for (const item of data) {
		const number = item.number;
		const binIndex = Math.floor(number / binSize);
		if (binIndex < numBins) {
			counts[binIndex]++;
		}
	}

	const result: reviewitem[] = counts.map((count, index) => {
		const binStart = (index * binSize).toFixed(1);
		const binEnd = ((index + 1) * binSize).toFixed(1); //  - ${binEnd}
		return {
			name: `${binStart}`,
			number: count,
		};
	});

	return result;
}

export function numsorter(data: reviewitem[]): reviewitem[] {
	return data.sort((a, b) => a.number - b.number);
}
