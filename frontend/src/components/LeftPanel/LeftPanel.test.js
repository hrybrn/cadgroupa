import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LeftPanel, { gameQuery } from './LeftPanel';

configure({ adapter: new Adapter() });

const fakeData = {
    friends: [
        {
            id: 'fakeID1',
            name: 'Fortnite',
            icon: 'https://avatars2.githubusercontent.com/u/7238161?s=460&v=4',
            modes: ['kill me', 'end me'],
        },
        {
            id: 'fakeID2',
            name: 'Harry Brown',
            icon: 'https://avatars0.githubusercontent.com/u/22686017?s=400&u=e16f1782281b7b948b69697032fcf2dd37029fa1&v=4',
            modes: ['kill me', 'end me'],
        },
        {
            id: 'fakeID3',
            name: 'Chris Coles',
            icon: 'https://avatars1.githubusercontent.com/u/12082667?s=460&v=4',
            modes: ['kill me', 'end me'],
        },
        {
            id: 'fakeID4',
            name: 'Costin Tiron',
            icon: 'https://avatars0.githubusercontent.com/u/22708853?s=460&v=4',
            modes: ['kill me', 'end me'],
        },
        {
            id: 'fakeID5',
            name: 'Brad Sharp',
            icon: 'https://scontent-lhr3-1.xx.fbcdn.net/v/t1.0-9/35058348_862784457256548_6881419506711789568_o.jpg?_nc_cat=105&_nc_ht=scontent-lhr3-1.xx&oh=3a864ded3901701f930c5261fa74777b&oe=5C95D5A7',
            modes: ['kill me', 'end me'],
        },
        {
            id: 'fakeID6',
            name: 'Aiden Devrell',
            icon: 'https://avatars3.githubusercontent.com/u/33784835?s=460&v=4',
            modes: ['kill me', 'end me'],
        },
    ],
};

const mocks = [
    {
        request: {
            query: gameQuery,
        },
        result: {
            data: {
                fakeData,
            },
        },
    },
];



describe('<LeftPanel />', () => {
    it('attempts to load leftpanel', () => {
        const component = shallow(
            <MockedProvider mocks={[]}>
                <LeftPanel />
            </MockedProvider>
        );
        expect(component.text().includes('Loading...'));
    });

    it('loads left panel', () => {
        const component = shallow(
            <MockedProvider mocks={mocks}>
                <LeftPanel />
            </MockedProvider>
        );
        expect(component.text().includes('Fortnite'));
    });
});
