import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import React from 'react';

import { tw } from '../../utils/tw';
import * as TabsPrimitive from '../primitives/Tabs';
import AreaGraph from './areagraph';
import { cdfcalc, numsorter } from './cdf';

interface Tab {
	title: string;
	value: string;
}

const RootWrapper = tw.div`flex items-center justify-center w-[full]`;

const tabs: Tab[] = [
	{
		title: 'Reviews',
		value: 'tab1',
	},
	{
		title: 'Rating Distributions',
		value: 'tab2',
	},
];

export interface reviewitem {
	name: string;
	number: number;
}

export interface data {
	// Define the structure of your data here
	data: reviewitem[]; // Use the same structure as your data
}

// const cdfcalc = (tabData: reviewitem[]) => {
// 	const counts: { [key: number]: number } = {};

// 	tabData.forEach(({ name, number }) => {
// 		counts[number] = (counts[number] || 0) + 1;
// 	});

// 	return Object.entries(counts).map(([number, count]) => ({
// 		name: number,
// 		number: count,
// 	}));
// };

export default function Tabs({ data }: data) {
	const [busynessData2, setBusynessData] = useState(data);
	const [updated, setUpdated] = useState(false);
	useEffect(() => {
		// Here you can update the data as needed, for example, fetching data from an API
		// For the sake of this example, I'm just setting it back to the original data
		setBusynessData(busynessData2);
		if (JSON.stringify(data) != JSON.stringify([[[1]]])) {
			setUpdated(true);
		}
	}, [data]);
	return (
		<RootWrapper>
			<TabsPrimitive.Root defaultValue="tab1">
				<TabsPrimitive.List>
					{tabs.map(({ title, value }) => (
						<TabsPrimitive.Trigger
							key={`tab-trigger-${value}`}
							value={value}
							className={clsx(
								'group',
								'first:rounded-tl-lg last:rounded-tr-lg',
								'border-b first:border-r last:border-l',
								'border-gray-300 dark:border-gray-600',
								'radix-state-active:border-b-gray-700 focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-gray-50 dark:radix-state-active:border-b-gray-100 dark:radix-state-active:bg-gray-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-gray-800',
								'w-full flex-1 px-3 py-2.5',
								'focus:radix-state-active:border-b-red',
								'focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
							)}
						>
							<span className={clsx('text-sm font-medium')}>{title}</span>
						</TabsPrimitive.Trigger>
					))}
				</TabsPrimitive.List>
				{tabs.map(({ value }) => (
					<TabsPrimitive.Content
						key={`tab-content-${value}`}
						value={value}
						className={clsx('rounded-b-lg px-6 py-4', {
							'bg-white dark:bg-gray-800': true, // Add background color classes here
						})}
					>
						{(() => {
							try {
								let tabData: reviewitem[] = [];

								if (data && Array.isArray(data)) {
									// Determine which tab's data to use based on the 'value'
									switch (value) {
										case 'tab1':
											tabData = numsorter(data);
											break;
										case 'tab2':
											tabData = cdfcalc(data);
											break;
									}
								}
								return (
									<div className="mt-10 flex w-full flex-col items-center justify-center">
										<AreaGraph receivedData={tabData} empty={!updated} />
										<div>{JSON.stringify(tabData)}</div>
									</div>
								);
							} catch (error) {
								console.error(error);
								return <div></div>;
							}
						})()}
					</TabsPrimitive.Content>
				))}
			</TabsPrimitive.Root>
		</RootWrapper>
	);
}
