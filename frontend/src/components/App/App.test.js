import React from 'react';
import App, { helloworld } from './App';

import { MockedProvider } from 'react-apollo/test-utils';

import renderer from 'react-test-renderer';
import wait from 'waait';

const mocks = [
	{
		request: {
			query: helloworld,
			variables: {
				name: 'Chris',
			},
		},
		result: {
			data: {
				hello: 'Hello Chris'
			},
		},
	},
];

it('should render loading state initially', () => {
	const component = renderer.create(
		<MockedProvider mocks={[]}>
			<App />
		</MockedProvider>,
	);

	const messageBox = component.root.findByType('p');
	expect(messageBox.children).toContain('Loading...');
});

it('should render data properly', async () => {
	const component = renderer.create(
		<MockedProvider mocks={mocks} addTypename={false}>
			<App />
		</MockedProvider>,
	);

	await wait(0); // https://www.apollographql.com/docs/react/recipes/testing.html#Testing-final-state read about this here

	const messageBox = component.root.findByType('p');
	expect(messageBox.children).toContain('Hello Chris');
});
