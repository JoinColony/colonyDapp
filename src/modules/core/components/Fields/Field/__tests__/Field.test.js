/* eslint-env jest */

import React from 'react';
import PropTypes from 'prop-types';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { Field as ReduxFormField } from 'redux-form';
import { shallowWithIntl, mountWithIntl } from '~utils/test';

import Field from '../Field.jsx';
import StandaloneField from '../../StandaloneField';
import FieldRow from '../../FieldRow';

jest.mock('shortid', () => ({
  generate: jest.fn(() => 'foo'),
}));

jest.mock('../../FieldRow/FieldRow.jsx');

const TestFieldComponent = () => <span />;

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('Field component standalone', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl((
      <Field name="test" standalone component={TestFieldComponent} />
    ));
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(StandaloneField)).toBePresent();
  });

  test('Receives actual fieldComponent as prop', () => {
    const wrapper = shallowWithIntl((
      <Field name="test" standalone component={TestFieldComponent} />
    ));
    expect(wrapper).toHaveProp('fieldComponent', TestFieldComponent);
  });

  test('Assembles a proper id for the field', () => {
    const wrapper = shallowWithIntl((
      <Field name="test" standalone component={TestFieldComponent} />
    ));
    expect(wrapper).toHaveProp('id', 'test_foo');
  });

  test('Uses the id provided if specified', () => {
    const wrapper = shallowWithIntl((
      <Field name="test" id="cool" standalone component={TestFieldComponent} />
    ));
    expect(wrapper).toHaveProp('id', 'cool');
  });

  test('Passes props to field wrapper', () => {
    const wrapper = shallowWithIntl((
      <Field
        className="className"
        name="test"
        data-foo="bar"
        standalone
        component={TestFieldComponent}
      />
    ));
    expect(wrapper.find(StandaloneField)).toHaveProp('className', 'className');
    expect(wrapper).toHaveProp('data-foo', 'bar');
  });

  test('Throws when using it without a rendered label and without an id', () => {
    expect(() => {
      shallowWithIntl((
        <Field name="test" standalone component={TestFieldComponent} elementOnly />
      ));
    }).toThrow();
  });

  test('Assembles labels properly', () => {
    const wrapperStringLabel = shallowWithIntl((
      <Field name="test" elementOnly label="Test" standalone component={TestFieldComponent} />
    ));
    expect(wrapperStringLabel).toHaveProp('label', 'Test');
    const wrapperMsgLabel = shallowWithIntl((
      <Field name="test" elementOnly label={{ id: 'foo', defaultMessage: 'Label' }} standalone component={TestFieldComponent} />
    ));
    expect(wrapperMsgLabel).toHaveProp('label', 'Label');
  });
});

describe('Field component embedded in redux-form', () => {
  const reduxFormStub = {
    form: 'stub',
    register: jest.fn(),
    getFormState: jest.fn(),
  };
  const reduxFormContext = {
    context: { _reduxForm: reduxFormStub, store: mockStore({}) },
    childContextTypes: { _reduxForm: PropTypes.object, store: PropTypes.object },
  };
  test('Contains a ReduxFormField', () => {
    const wrapper = mountWithIntl(
      (
        <Field name="test" label="Test" component={TestFieldComponent} />
      ),
      reduxFormContext,
    );
    expect(wrapper.find(ReduxFormField)).toBePresent();
  });
  test('Assembles field id', () => {
    const wrapper = mountWithIntl(
      (
        <Field name="test" label="Test" component={TestFieldComponent} />
      ), reduxFormContext,
    );
    expect(wrapper.find(FieldRow)).toHaveProp('id', 'stub_test_foo');
  });
});
