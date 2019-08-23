/* eslint-env jest */
/* eslint-disable react/prop-types */

import React from 'react';
import { mount } from 'enzyme';

import withWizard from '../withWizard';

const Wrapper = ({ children, step }) => (
  <div>
    <h1>Step: {step}</h1>
    <div>{children}</div>
  </div>
);

// eslint-disable-next-line react/prop-types
const createStep = (number, customValues) => ({ nextStep }) => (
  <div>
    <h2>Step number {number}</h2>
    <button type="button" onClick={() => nextStep(customValues)}>
      Click me
    </button>
  </div>
);

describe('withWizard HoC', () => {
  test('Renders initial step - use with Steps array', () => {
    // @ts-ignore
    const stepsArray = [createStep(1), createStep(2)];
    const Wizard = withWizard({ steps: stepsArray })(Wrapper);
    const wrapper = mount(<Wizard />);
    (expect(wrapper.find('h1')) as any).toHaveText('Step: 1');
  });

  test('Renders second step nextStep is called - use with Steps array', () => {
    // @ts-ignore
    const stepsArray = [createStep(1), createStep(2)];
    const Wizard = withWizard({ steps: stepsArray })(Wrapper);
    const wrapper = mount(<Wizard />);
    wrapper.find('button').simulate('click');
    (expect(wrapper.find('h1')) as any).toHaveText('Step: 2');
  });

  test('Renders initial step - use with Steps function', () => {
    // @ts-ignore
    const stepsArray = [createStep(1), createStep(2)];

    // Very simple. See next test for complex example
    const stepsFunction = step => stepsArray[step];

    const Wizard = withWizard({ steps: stepsFunction })(Wrapper);
    const wrapper = mount(<Wizard />);
    (expect(wrapper.find('h2')) as any).toHaveText('Step number 1');
  });

  test('Renders second step - use with Steps function', () => {
    const stepsArray = [
      createStep(1, { path: 'skip2' }),
      // @ts-ignore
      createStep(2),
      // @ts-ignore
      createStep(3),
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
    wrapper.find('button').simulate('click');
    (expect(wrapper.find('h2')) as any).toHaveText('Step number 3');
  });
});
