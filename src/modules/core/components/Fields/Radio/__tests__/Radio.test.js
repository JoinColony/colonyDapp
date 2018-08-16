/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import Radio from '../Radio.jsx';

describe('Radio component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl(
      <Radio
        name="radioInput"
        help="halp"
        label="awesome"
        value="radioInput"
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
