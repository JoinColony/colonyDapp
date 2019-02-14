/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import CreateColonyWizard from '../CreateColonyWizard.jsx';

describe('CreateColonyWizard component', () => {
  test('Renders initial component (snapshot)', () => {
    const wrapper = shallowWithIntl(<CreateColonyWizard />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
