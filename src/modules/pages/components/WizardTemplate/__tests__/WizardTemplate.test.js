/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import WizardTemplate from '../WizardTemplate.jsx';

describe('WizardTemplate component', () => {
  test('Renders initial component', () => {
    const component = shallowWithIntl(
      <WizardTemplate stepCount={2} step={1} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
