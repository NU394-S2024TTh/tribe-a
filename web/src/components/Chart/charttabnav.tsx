import './styles.css';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import React from 'react';

import { tw } from '../../utils/tw';
import * as TabsPrimitive from '../primitives/Tabs';
import AreaGraph from './areagraph';
import { cdfcalc, numsorter } from './cdf';
import BarGraph from './livegraph';

interface Tab {
	title: string;
	value: string;
}

const RootWrapper = tw.div`flex items-center justify-center w-[full]`;

const tabs: Tab[] = [
	{
		title: 'Review Frequency Analysis',
		value: 'tab1',
	},
	{
		title: 'Sentiment Analysis',
		value: 'tab2',
	},
];

export interface reviewitem {
	name: string;
	number: number;
}

export interface data {
	data: reviewitem[];
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

const siteData = [
	{
		name: 'Paramount +',
		number: '3',
	},
	{
		name: 'IMDb',
		number: '1.6',
	},
	{
		name: 'Netflix',
		number: '4',
	},
	{
		name: 'Rotten Apples',
		number: '4.7',
	},
	{
		name: 'Letterboxd',
		number: '3.6',
	},
];

// {clsx(
//     'group',
//     'first:rounded-tl-lg last:rounded-tr-lg',
//     'border-white',
//     'border-white dark:border-white',
//     'radix-state-active:border-white focus-visible:radix-state-active:border-white radix-state-inactive:bg-gray-50 dark:radix-state-active:border-white dark:radix-state-active:bg-gray-900 focus-visible:dark:radix-state-active:border-white dark:radix-state-inactive:bg-white',
//     'w-full flex-1 px-3 py-2.5',
//     'focus:radix-state-active:border-white',
//     'focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
// )}

export default function Tabs({ data }: data) {
	const [modData, setData] = useState(data);
	const [updated, setUpdated] = useState(false);
	useEffect(() => {
		setData(modData);
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
							className="border-white bg-white shadow-none"
						>
							<span className={clsx('text-sm font-medium text-white')}>{title}</span>
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
											tabData = cdfcalc(data, 10);
											break;
										case 'tab2':
											tabData = numsorter(data);
											break;
									}
								}
								if (value == 'tab1') {
									return (
										<div className="mt-10 flex w-full flex-col items-center justify-center">
											<AreaGraph receivedData={tabData} empty={!updated} />
											{/* <div>{JSON.stringify(tabData)}</div> THIS IS FOR DEBUGGING TO SEE THE RAW JSON DATA*/}
										</div>
									);
								} else if (value == 'tab2') {
									return (
										<div className="mt-10 flex w-full flex-col items-center justify-center">
											<BarGraph receivedData={siteData} empty={!updated} />
											{/* <div>{JSON.stringify(tabData)}</div> THIS IS FOR DEBUGGING TO SEE THE RAW JSON DATA*/}
										</div>
									);
								}
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
