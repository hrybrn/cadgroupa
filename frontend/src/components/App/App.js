import React, { Component } from 'react';
import './App.css';

import Navigation from '../Navigation/Navigation';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';

class App extends Component {
	render() {		
		return (
			<div className="App">
				<Navigation />
				<LeftPanel />
				<RightPanel />
			</div>
		);
	}
}

export default App;
