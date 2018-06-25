/* @flow */
/* eslint-env jest */

import React from 'react';
import type { Node } from 'react';
import { mount } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import { object } from 'prop-types';

import withWizard from '../Wizard';

const mountWithStore = node =>
  mount(node, {
    context: {
      store: createMockStore('state'),
    },
    childContextTypes: {
      /*
       * We still use proptypes here for the context object, so this rule has
       * to be manually disabled in most Form unit tests
       */
      /* eslint-disable react/forbid-prop-types */
      store: object,
      /* eslint-enable react/forbid-prop-types */
    },
  });

describe('Wizard enhancer', () => {
  const steps = [
    {
      Step: () => <div>First page</div>,
      validate: () => ({ bar: 'foo' }),
      extraProp: 'baz',
    },
    {
      Step: () => <div>Second page</div>,
      validate: () => ({ foo: 'bar' }),
    },
  ];

  const OuterComponent = ({ children }: { children: Node }) => (
    <div>{children}</div>
  );
  const Wizard = withWizard({ form: 'test_wizard', steps })(OuterComponent);

  test('Renders first page inside container component per default', () => {
    const wrapper = mountWithStore(<Wizard />);
    const { Step } = steps[0];
    expect(wrapper.find(OuterComponent)).toExist();
    expect(wrapper.find(Step)).toExist();
  });

  test('Renders second page inside container on state change', () => {
    const wrapper = mountWithStore(<Wizard />);
    wrapper.setState({ step: 1 });
    const { Step } = steps[1];
    expect(wrapper.find(OuterComponent)).toExist();
    expect(wrapper.find(Step)).toExist();
  });

  test('Step is a redux-form', () => {
    const wrapper = mountWithStore(<Wizard />);
    const step = wrapper.find(steps[0].Step);
    expect(typeof step.prop('handleSubmit')).toBe('function');
  });

  test('Step has nextStep and previousStep functions', () => {
    const wrapper = mountWithStore(<Wizard />);
    const step = wrapper.find(steps[0].Step);
    expect(typeof step.prop('nextStep')).toBe('function');
    expect(typeof step.prop('previousStep')).toBe('function');
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
    const { Step, validate } = steps[0];
    const step = wrapper.find(Step);
    expect(step.prop('validate')).toEqual(validate);
  });

  test('Passes extra step props to outer component', () => {
    const wrapper = mountWithStore(<Wizard />);
    const { extraProp } = steps[0];
    const outer = wrapper.find(OuterComponent);
    expect(outer.prop('extraProp')).toBe(extraProp);
  });
});
