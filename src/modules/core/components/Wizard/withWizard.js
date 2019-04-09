/* @flow */

import type { ComponentType } from 'react';

import { createElement, Component } from 'react';
import { List, Map as ImmutableMap } from 'immutable';

type Props = {};

type Values = { [formValue: string]: any };

type ValueList = List<Values>;

type State = {
  step: number,
  values: ValueList,
};

type StepType = ComponentType<any>;

type StepsFn = (step: number, values: Values) => StepType;

type Steps = Array<StepType> | StepsFn;

type WizardArgs = {
  stepCount?: number,
  steps: Steps,
};

const all = (values: ValueList) =>
  values.reduce((map, curr) => map.merge(curr), ImmutableMap()).toJS();

const getStep = (steps: Steps, step: number, values: Object) =>
  typeof steps === 'function' ? steps(step, values) : steps[step];

const withWizard = ({ steps, stepCount: maxSteps }: WizardArgs) => (
  OuterComponent: ComponentType<Object>,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0, values: new List() };

    next = (values: Values) => {
      this.setState(({ step, values: currentValues }) => ({
        step: step + 1,
        values: currentValues.set(step, values),
      }));
    };

    // Todo: when going back we could instead store the isValid state of the form when going back
    prev = (values?: Values) => {
      this.setState(({ step, values: currentValues }) => ({
        step: step === 0 ? 0 : step - 1,
        // Going back we only want to set values when we actually have some
        values:
          values && Object.keys(values).length
            ? currentValues.set(step, values)
            : currentValues,
      }));
    };

    render() {
      const { step, values } = this.state;
      const allValues = all(values);
      const Step = getStep(steps, step, allValues);

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
          wizardValues: allValues,
          // Wizard form helpers to take some shortcuts if needed
          wizardForm: {
            // Get values just for this step
            initialValues: values.get(step),
            // It must be valid if we submitted values for this step before
            isInitialValid: ({ initialValues }) => !!initialValues,
          },
        }),
      );
    }
  }
  return Wizard;
};

export default withWizard;
