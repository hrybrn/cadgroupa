import React from 'react';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import expect from 'expect';

import Navigation from './Navigation';
import AppBar from '@material-ui/core/AppBar';
import Popover from '@material-ui/core/Popover';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';

configure({ adapter: new Adapter() });

describe('<Navigation />', () => {
    it('loads an AppBar', () => {
        const component = mount(<Navigation />);
        expect(component.find(AppBar)).toHaveLength(1);
    });

    it('opens account options', () => {
        const component = mount(<Navigation />);
        expect(component.find(IconButton).filter('.accountButton').simulate('click').containsMatchingElement(Popover));
    });

    it('opens left side drawer', () => {
        const component = mount(<Navigation />);
        expect(component.find(IconButton).filter('.drawerButton').simulate('click').containsMatchingElement(Drawer));
    });
});
