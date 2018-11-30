import React from 'react';

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import expect from 'expect';

import Navigation from './Navigation';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';

configure({ adapter: new Adapter() });

describe('<Navigation />', () => {

    it('loads an AppBar', () => {
        const component = shallow(<Navigation />);
        expect(component.find(AppBar)).toHaveLength(1);
    });

    it('opens account options', () => {
        const component = mount(<Navigation />);
        expect(component.find('.accountMenu').children().find(IconButton).simulate('click').containsMatchingElement(Popover));
    });

    it('opens left side drawer', () => {
        const component = mount(<Navigation />);
        expect(component.find(AppBar).children().find(Toolbar).children().find(IconButton).simulate('click').containsMatchingElement(Drawer));
    });
});
