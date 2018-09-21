/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import DecisionHub from '../DecisionHub.jsx';

describe('DecisionHub component', () => {
  test('Renders initial component', () => {

    const MSG = {
      createTokenTitle: {
        id: 'ComponentName.special',
        defaultMessage: 'Rule the world',
      },
      createTokenSubtitle: {
        id: 'ComponentName.exceptional',
        defaultMessage: 'Collaborate with others',
      },
      selectTokenTitle: {
        id: 'ComponentName.special',
        defaultMessage: 'Rule the world',
      },
      selectTokenSubtitle: {
        id: 'ComponentName.exceptional',
        defaultMessage: 'Collaborate with others',
      },
    };

    const options = [
      {
        value: 'create',
        title: MSG.createTokenTitle,
        subtitle: MSG.createTokenSubtitle,
      },
      {
        value: 'select',
        title: MSG.selectTokenTitle,
        subtitle: MSG.selectTokenSubtitle,
      },
    ];

    const wrapper = shallowWithIntl(<DecisionHub options={options} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
