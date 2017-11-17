/* eslint-env jest */

import React from 'react';
import { mount } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import { object } from 'prop-types';

import withWizard from '../Wizard';

const mountWithStore = node => mount(node, {
  context: {
    store: createMockStore('state'),
  },
  childContextTypes: {
    store: object,
  },
});

describe('Wizard enhancer', () => {
  const steps = [
    { Step: () => <div>First page</div>, validate: () => ({ bar: 'foo' }) },
    { Step: () => <div>Second page</div>, validate: () => ({ foo: 'bar' }) },
  ];

  const OuterComponent = ({ children }: { children: React.Node }) => <div>{ children }</div>;
  const Wizard = withWizard({ form: 'test_wizard', steps })(OuterComponent);

  test('Renders first page inside container component per default', () => {
    const wrapper = mountWithStore(<Wizard />);
    const { Step } = steps[0];
    expect(wrapper.find(OuterComponent)).toBePresent();
    expect(wrapper.find(Step)).toBePresent();
  });

  test('Renders second page inside container on state change', () => {
    const wrapper = mountWithStore(<Wizard />);
    wrapper.setState({ step: 1 });
    const { Step } = steps[1];
    expect(wrapper.find(OuterComponent)).toBePresent();
    expect(wrapper.find(Step)).toBePresent();
  });

  test('Wrapper is a redux-form', () => {
    const wrapper = mountWithStore(<Wizard />);
    const outer = wrapper.find(OuterComponent);
    expect(outer.prop('form')).toEqual('test_wizard');
  });

  test('Can go to the next step', () => {
    const wrapper = mountWithStore(<Wizard />);
    wrapper.instance().next();
    // We can't test for wrapper.find(Step) here for some reason
    expect(wrapper.html()).toContain('Second page');
  });

  test('Can go to the previous step', () => {
    const wrapper = mountWithStore(<Wizard />);
    wrapper.setState({ step: 1 });
    wrapper.instance().prev();
    expect(wrapper.html()).toContain('First page');
  });

  test('Can only go as far as we have steps', () => {
    const wrapper = mountWithStore(<Wizard />);
    wrapper.setState({ step: 1 });
    wrapper.instance().next();
    expect(wrapper.html()).toContain('Second page');
    wrapper.setState({ step: 0 });
    wrapper.instance().prev();
    expect(wrapper.html()).toContain('First page');
  });

  test('Passes down validation', () => {
    const wrapper = mountWithStore(<Wizard />);
    const outer = wrapper.find(OuterComponent);
    const { validate } = steps[0];
    expect(outer.prop('validate')).toEqual(validate);
  });
});
