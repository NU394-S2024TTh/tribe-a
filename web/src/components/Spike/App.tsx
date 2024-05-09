import './App.css';

import Cardtable from './cardtable';
function App() {
	return (
		<div className="App">
			<div className="flex flex-none flex-col">
				<h1 className="my-10 text-xl font-bold">Tribe A Members</h1>
				<div className="flex items-center justify-center">
					<Cardtable></Cardtable>
				</div>
			</div>
		</div>
	);
}

export default App;
