/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import ProfileCreate from '../ProfileCreate.jsx';

describe('ProfileCreate component', () => {
  test('Renders initial component (snapshot)', () => {
    const wrapper = shallowWithIntl(<ProfileCreate />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
