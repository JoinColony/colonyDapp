/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import RadioInput from '../RadioInput.jsx';

describe('RadioInput component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl(
      <RadioInput
        name="radioInput"
        help="halp"
        label="awesome"
        value="radioInput"
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
