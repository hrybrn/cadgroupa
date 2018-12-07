import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CardTile from './CardTile';

configure({ adapter: new Adapter() });

const friend = {
    id: 'fakeID1',
    name: 'Elliot Alexander',
    icon: 'https://avatars2.githubusercontent.com/u/7238161?s=460&v=4',
};

describe('<CardTile />', () => {
    it('loads friend', () => {
        const component = shallow(
            <CardTile {...friend} />
        );
        expect(component.text().includes('Elliot Alexander'));
        expect(component.html().includes('https://avatars2.githubusercontent.com/u/7238161?s=460&v=4'));
    });
});
