/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from 'testutils';

import DecisionHub from '../DecisionHub.jsx';

describe('DecisionHub component', () => {
  test('Renders initial component', () => {
    const rowTitles = {
      superCreativeTitle: {
        id: 'ComponentName.special',
        defaultMessage: 'Rule the world',
      },
      evenMoreCreativeTitle: {
        id: 'ComponentName.exceptional',
        defaultMessage: 'Collaborate with others',
      },
    };

    const rowSubTitles = {
      superCreativeTitle: {
        id: 'ComponentName.specialSub',
        defaultMessage: 'But be nice',
      },
      evenMoreCreativeTitle: {
        id: 'ComponentName.exceptionalSub',
        defaultMessage: 'And kick ass',
      },
    };
    const wrapper = shallowWithIntl(
      <DecisionHub rowTitles={rowTitles} rowSubTitles={rowSubTitles} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
