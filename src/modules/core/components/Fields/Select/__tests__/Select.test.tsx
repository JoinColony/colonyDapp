/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { Form } from '~core/Fields';
import { mountWithIntl } from '~testutils';

import Select from '../Select';

const DEFAULT_PROPS = {
  id: 'someStaticId',
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
  'data-test': 'selectButton',
};

jest.mock('~core/UserPickerWithSearch/hooks', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Select component', () => {
  test('Renders initial component', () => {
    const wrapper = mountWithIntl(
      <Form initialValues={{ foo: undefined }} onSubmit={() => {}}>
        <Select {...DEFAULT_PROPS} />
      </Form>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
