import './App.css';

import CardTable from './CardTable';
function App() {
	return (
		<div className="App">
			<div className="flex flex-none flex-col">
				<h1 className="my-10 text-xl font-bold">Tribe A Members</h1>
				<div className="flex items-center justify-center">
					<CardTable></CardTable>
				</div>
			</div>
		</div>
	);
}

export default App;
