/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '~utils/test';

import CreateColony from '../CreateColony.jsx';

describe('CreateColony component', () => {
  test('Renders initial component (snapshot)', () => {
    const wrapper = shallowWithIntl((
      <CreateColony />
    ));
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
