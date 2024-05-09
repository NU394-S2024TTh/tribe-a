import './themes/index.css';

import { Theme } from '@radix-ui/themes';
import React from 'react';
import ReactDOM from 'react-dom/client';

import Home from './pages/Home';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<Theme accentColor="grass">
			<Home />
		</Theme>
	</React.StrictMode>,
);
