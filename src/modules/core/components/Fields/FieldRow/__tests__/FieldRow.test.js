/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '~utils/test';

import FieldRow from '../FieldRow.jsx';

const TestFieldComponent = () => <div />;

describe('FieldRow component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl((
      <FieldRow
        name="test"
        fieldComponent={TestFieldComponent}
        meta={{ touched: false, pristine: false, error: false, active: false }}
        utils={{}}
        input={{ checked: false, disabled: false, onChange: jest.fn() }}
      />
    ));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('With hasError, error shows instead of title', () => {
    const wrapper = shallowWithIntl((
      <FieldRow
        title="AwesomeComponent"
        name="test"
        fieldComponent={TestFieldComponent}
        meta={{ touched: true, pristine: false, error: 'You made a booboo', active: false }}
        utils={{}}
      />
    ));
    expect(wrapper.prop('inputProps').title).toBe('You made a booboo');
  });
});
