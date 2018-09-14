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

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children, step }) => (
  <div>
    <h1>Step: {step}</h1>
    <div>{children}</div>
  </div>
);

// eslint-disable-next-line react/prop-types
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

  test('Renders initial step - use with Steps function', () => {
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

    // Very simple. See next test for complex example
    const stepsFunction = step => stepsArray[step];

    const Wizard = withWizard({ steps: stepsFunction })(Wrapper);
    const wrapper = mount(<Wizard />);
    expect(wrapper.find('h2')).toHaveText('Step number 1');
  });

  test('Renders second step - use with Steps function', () => {
    const { promise, resolvePromise } = createPromise();
    const stepsArray = [
      {
        Step: createStep(1),
        onSubmit: (values, { nextStep }) => {
          nextStep();
          resolvePromise();
        },
        formikConfig: {
          mapPropsToValues: () => ({ path: 'skip2' }),
        },
      },
      {
        Step: createStep(2),
        onSubmit,
      },
      {
        Step: createStep(3),
        onSubmit,
      },
    ];

    const stepsFunction = (step, { path }) => {
      // if path == 'skip2' skip the second step
      if (step === 1 && path === 'skip2') {
        return stepsArray[2];
      }
      return stepsArray[step];
    };

    const Wizard = withWizard({ steps: stepsFunction })(Wrapper);
    const wrapper = mount(<Wizard />);
    wrapper.find('form').simulate('submit');
    return promise.then(() => {
      wrapper.update();
      expect(wrapper.find('h2')).toHaveText('Step number 3');
    });
  });
});
