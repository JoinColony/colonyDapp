/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { mountWithIntl } from '~testutils';

import InputLabel from '../InputLabel';

describe('InputLabel intl={intl} component', () => {
  test('Renders initial component', () => {
    const wrapper = mountWithIntl(
      <InputLabel appearance={{}} inputId="foo" help="halp" label="awesome" />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('If error is false, and help is true, returns help field', () => {
    const wrapper = mountWithIntl(
      <InputLabel inputId="foo" help="(halp)" label="awesome" />,
    );
    expect(wrapper.html()).toContain('(halp)');
  });
});
