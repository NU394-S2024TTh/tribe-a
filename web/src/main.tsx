import './themes/index.css';

import { Theme } from '@radix-ui/themes';
import React from 'react';
import { type PropsWithChildren } from 'react';
import ReactDOM from 'react-dom/client';

import ChatBot from './components/chatbox/Chatbox';
import Home from './pages/Home';
const PageWrapper = (props: PropsWithChildren) => {
	const { children } = props;

	return (
		<div className="relative py-[72px]">
			{children}
			<div className="absolute bottom-0 left-0 right-0 top-0 -z-10">
				<svg className="h-full w-full opacity-5">
					<defs>
						<pattern
							id="grid"
							x="0"
							y="0"
							width="32"
							height="32"
							patternUnits="userSpaceOnUse"
							className="fill-none stroke-white"
						>
							<path d="M0 .5H31.5V32" />
						</pattern>
						<linearGradient id="fade-horizontal">
							<stop offset="0%" stopColor="black" stopOpacity="1" />
							<stop offset="50%" stopColor="white" stopOpacity="0" />
						</linearGradient>
						<linearGradient id="fade-vertical" gradientTransform="rotate(90)">
							<stop offset="0%" stopColor="white" stopOpacity="1" />
							<stop offset="20%" stopColor="white" stopOpacity="0" />
						</linearGradient>
						<mask id="mask">
							<rect width="100%" height="100%" fill="url(#fade-horizontal)" />
							<rect width="100%" height="100%" fill="url(#fade-vertical)" />
						</mask>
					</defs>

					<rect
						x="0"
						y="0"
						className="h-full w-full"
						fill="url(#grid)"
						mask="url(#mask)"
					></rect>
				</svg>
			</div>
		</div>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<Theme accentColor="grass">
			<PageWrapper>
				<Home />
				<ChatBot />
			</PageWrapper>
		</Theme>
	</React.StrictMode>,
);
