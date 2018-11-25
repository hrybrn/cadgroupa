import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class App extends Component {
	render() {
		const message = this.props.data.loading ? 'Loading...' : this.props.data.hello;
		
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>{message}</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
				</header>
			</div>
		);
	}
}

export const helloworld = gql`query($name: String) {
	hello(name: $name)
}`;

export default graphql(helloworld, {
	options: {
		variables: {
			name: 'Chris'
		}
	}
})(App);
