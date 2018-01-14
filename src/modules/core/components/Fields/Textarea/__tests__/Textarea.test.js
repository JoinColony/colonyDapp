/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '$utils/test';

import Textarea from '../Textarea.jsx';
import InputLabel from '../../InputLabel';

jest.mock('../../InputLabel');

describe('Textarea component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl((
      <Textarea
        meta={{ active: false }}
        elementOnly={false}
        label="foo"
        input={{ id: 'foo' }}
        inputProps={{}}
        passthroughProps={{}}
        help="halp"
        error="red"
        hasError={false}
      />
    ));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Does not wrap with InputLabel without label prop', () => {
    const wrapper = shallowWithIntl((
      <Textarea
        meta={{ active: false }}
        elementOnly={false}
        input={{}}
        inputProps={{ id: 'foo' }}
        passthroughProps={{}}
      />
    ));
    expect(wrapper.find(InputLabel)).not.toBePresent();
  });

  test('Does not wrap with InputLabel if elementOnly is true', () => {
    const wrapper = shallowWithIntl((
      <Textarea
        meta={{ active: false }}
        elementOnly
        label="foo"
        input={{}}
        inputProps={{ id: 'foo' }}
        passthroughProps={{}}
      />
    ));
    expect(wrapper.find(InputLabel)).not.toBePresent();
  });
});
