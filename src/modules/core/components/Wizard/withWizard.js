/* @flow */

import type { ComponentType } from 'react';

import { createElement, Component } from 'react';
import { List, Map as ImmutableMap } from 'immutable';

type Props = {};

type Values = Object;

type ValueList = List<Values>;

type State = {
  step: number,
  values: ValueList,
};

type StepType = ComponentType<any>;

type StepsFn<T> = (step: number, values: Object, props?: T) => StepType;

type Steps = Array<StepType> | StepsFn<Object>;

type WizardArgs = {
  stepCount?: number,
  steps: Steps,
};

const all = (values: ValueList) =>
  values.reduceRight((map, curr) => map.merge(curr), ImmutableMap()).toJS();

const getStep = (steps: Steps, step: number, values: Object, props?: Object) =>
  typeof steps === 'function' ? steps(step, values, props) : steps[step];

const withWizard = ({ steps, stepCount: maxSteps }: WizardArgs) => (
  OuterComponent: ComponentType<Object>,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0, values: new List() };

    setValues = (values?: Values) => {
      this.setState(({ step, values: currentValues }) => ({
        values:
          values && Object.keys(values).length
            ? currentValues.set(step, values)
            : currentValues,
      }));
    };

    next = (values: Values) => {
      this.setState(({ step }) => ({ step: step + 1 }));
      this.setValues(values);
    };

    prev = (values?: Values) => {
      const { step: currentStep } = this.state;
      /* Inform developer if step has been changed
       * if we are already in the first step there
       * is no way of going back within the wizard
       */
      if (currentStep === 0) {
        return false;
      }
      this.setState(({ step }) => ({ step: step === 0 ? 0 : step - 1 }));
      this.setValues(values);
      return true;
    };

    render() {
      const { step, values } = this.state;
      const allValues = all(values);
      const Step = getStep(steps, step, allValues, this.props);

      if (!Step) throw new Error('Step needs to be implemented!');

      const currentStep = step + 1;
      const stepCount = maxSteps || steps.length;

      return createElement(
        OuterComponent,
        {
          step: currentStep,
          stepCount,
          nextStep: this.next,
          previousStep: this.prev,
          wizardValues: allValues,
          ...this.props,
        },
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
