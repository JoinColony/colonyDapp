/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '$utils/test';

import InputLabel from '../InputLabel.jsx';

describe('InputLabel intl={intl} component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl((
      <InputLabel appearance={{}} id="foo" help="halp" error="red" label="awesome" />
    ));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('If error is false, and help is true, returns help field', () => {
    const wrapper = shallowWithIntl((
      <InputLabel id="foo" help="halp" label="awesome" />
    ));
    expect(wrapper.find('span').last().text()).toEqual('(halp)');
  });
});
