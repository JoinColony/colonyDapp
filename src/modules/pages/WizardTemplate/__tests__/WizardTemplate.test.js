/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import WizardTemplate from '../WizardTemplate.jsx';

describe('WizardTemplate component', () => {
  test('Renders initial component', () => {
    const component = shallowWithIntl(<WizardTemplate />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
