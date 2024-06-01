/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import React from 'react';

import { getPlatformData } from '../../firebase/firebasefunctions';
import { tw } from '../../utils/tw';
import * as TabsPrimitive from '../primitives/Tabs';
import AreaGraph from './AreaGraph';
import { cdfcalc, numsorter } from './CDF';
import BarGraph from './LiveGraph';
import TrendAnalysis from './TrendGraph';

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
	{
		title: 'Trend Analysis',
		value: 'tab3',
	},
];

export interface reviewitem {
	name: string;
	number: number;
}

export interface data {
	data: number[];
}

interface TabsProps {
	data: { sentiment: number; created: string; source: string }[];
}

function formatData(reviews: { sentiment: number; created: string }[]) {
	const data = reviews.map((review, index) => ({
		name: (index + 1).toString(),
		number: review.sentiment,
	}));
	return data;
}

// const siteData = [
// 	{
// 		name: 'Paramount +',
// 		number: '3',
// 	},
// 	{
// 		name: 'IMDb',
// 		number: '1.6',
// 	},
// 	{
// 		name: 'Netflix',
// 		number: '4',
// 	},
// 	{
// 		name: 'Rotten Apples',
// 		number: '4.7',
// 	},
// 	{
// 		name: 'Letterboxd',
// 		number: '3.6',
// 	},
// ];

export default function Tabs({ data }: TabsProps) {
	const [modData, setData] = useState(data);
	const [updated, setUpdated] = useState(false);

	useEffect(() => {
		setData(modData);
		if (
			JSON.stringify(modData) != JSON.stringify([[[1]]]) ||
			JSON.stringify(modData) != null
		) {
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
							'bg-white dark:bg-gray-800': true,
						})}
					>
						{(() => {
							try {
								let tabData: reviewitem[] = [];

								if (data && Array.isArray(data)) {
									switch (value) {
										case 'tab1':
											tabData = cdfcalc(formatData(data), 10);
											break;
										case 'tab2':
											tabData = numsorter(formatData(data));
											break;
										case 'tab3':
											break;
									}
								}
								if (value == 'tab1') {
									return (
										<div className="mt-10 flex w-full flex-col items-center justify-center">
											<AreaGraph receivedData={tabData} empty={!updated} />
										</div>
									);
								} else if (value == 'tab2') {
									return (
										<div className="mt-10 flex w-full flex-col items-center justify-center">
											<BarGraph receivedData={getPlatformData(data)} empty={!updated} />
										</div>
									);
								} else if (value === 'tab3') {
									return (
										<div className="mt-10 flex w-full flex-col items-center justify-center">
											<TrendAnalysis data={data} />
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
