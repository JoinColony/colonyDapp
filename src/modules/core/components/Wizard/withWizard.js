/* @flow */

import type { ComponentType } from 'react';

import { createElement, Component } from 'react';

type Props = {};

type AnyValues = { [string]: any };

type State = {
  step: number,
  values: AnyValues,
};

type StepType = ComponentType<any>;

type StepsFn = (step: number, values: Object) => StepType;

type Steps = Array<StepType> | StepsFn;

type WizardArgs = {
  stepCount?: number,
  steps: Steps,
};

const getStep = (steps: Steps, step: number, values: Object) =>
  typeof steps === 'function' ? steps(step, values) : steps[step];

const withWizard = ({ steps, stepCount: maxSteps }: WizardArgs) => (
  OuterComponent: ComponentType<Object>,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0, values: {} };

    next = (values: AnyValues) => {
      this.setState(({ step, values: currentValues }) => ({
        step: step + 1,
        values: { ...currentValues, ...values },
      }));
    };

    prev = (values: AnyValues) => {
      this.setState(({ step, values: currentValues }) => ({
        step: step === 0 ? 0 : step - 1,
        values: { ...currentValues, ...values },
      }));
    };

    render() {
      const { step, values } = this.state;
      const Step = getStep(steps, step, values);

      if (!Step) throw new Error('Step needs to be implemented!');

      const currentStep = step + 1;
      const stepCount = maxSteps || steps.length;

      return createElement(
        OuterComponent,
        { step: currentStep, stepCount, ...this.props },
        createElement(Step, {
          step: currentStep,
          stepCount,
          nextStep: this.next,
          previousStep: this.prev,
          wizardValues: values,
        }),
      );
    }
  }
  return Wizard;
};

export default withWizard;
