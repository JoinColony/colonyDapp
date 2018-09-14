/* eslint-env jest */

import React from 'react';
import { mount } from 'enzyme';

import withWizard from '../withWizard';

const createPromise = () => {
  let resolvePromise;
  let rejectPromise;
  const promise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, resolvePromise, rejectPromise };
};

const onSubmit = (values, { nextStep }) => nextStep();

const Wrapper = ({ children, step, stepCount }) => (
  <div>
    <h1>Step: {step}</h1>
    <div>{children}</div>
  </div>
);

const createStep = number => ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <h2>Step number {number}</h2>
  </form>
);

describe('withWizard HoC', () => {
  test('Renders initial step - use with Steps array', () => {
    const stepsArray = [
      {
        Step: createStep(1),
        onSubmit,
      },
      {
        Step: createStep(2),
        onSubmit,
      },
    ];
    const Wizard = withWizard({ steps: stepsArray })(Wrapper);
    const wrapper = mount(<Wizard />);
    expect(wrapper.find('h1')).toHaveText('Step: 1');
  });

  test('Renders second step after form submit - use with Steps array', () => {
    const { promise, resolvePromise } = createPromise();
    const stepsArray = [
      {
        Step: createStep(1),
        onSubmit: (values, { nextStep }) => {
          nextStep();
          resolvePromise();
        },
      },
      {
        Step: createStep(2),
        onSubmit,
      },
    ];
    const Wizard = withWizard({ steps: stepsArray })(Wrapper);
    const wrapper = mount(<Wizard />);
    wrapper.find('form').simulate('submit');
    return promise.then(() => {
      wrapper.update();
      expect(wrapper.find('h1')).toHaveText('Step: 2');
    });
  });
});
