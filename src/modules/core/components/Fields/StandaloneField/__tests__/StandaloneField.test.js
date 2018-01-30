/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '~utils/test';

import StandaloneField from '../StandaloneField.jsx';

const TestFieldComponent = () => <span />;

describe('StandaloneField component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl(
      <StandaloneField
        component={TestFieldComponent}
        help="halp"
        error="red"
        hasError={false}
        label="awesome"
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    // component prop not present, but "intl" and "meta" added
    expect(Object.keys(wrapper.props())).toHaveLength(8);
  });
});
