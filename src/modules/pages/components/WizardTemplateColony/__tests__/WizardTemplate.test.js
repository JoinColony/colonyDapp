/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import WizardTemplateColony from '../WizardTemplateColony.jsx';

describe('WizardTemplateColony component', () => {
  test('Renders initial component', () => {
    const component = shallowWithIntl(
      <WizardTemplateColony stepCount={2} step={1} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
