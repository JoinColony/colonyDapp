/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'enzyme-react-intl';

import Radio from '../Radio';

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
