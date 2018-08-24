/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import ProfileCreateForm from '../ProfileCreateForm.jsx';

describe('ProfileCreateForm component', () => {
  test('Renders initial component (snapshot)', () => {
    const wrapper = shallowWithIntl(<ProfileCreateForm />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
