/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import Select from '../Select.jsx';

const DEFAULT_PROPS = {
  label: 'Select me',
  name: 'foo',
  options: [
    {
      value: 'foo_value',
      label: 'Foo',
    },
    {
      value: 'bar_value',
      // Yes, it works with MessageDescriptors as well!
      label: { id: 'Select.Bar', defaultMessage: 'Bar' },
    },
  ],
  connect: false,
};

describe('Select component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl(<Select {...DEFAULT_PROPS} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
