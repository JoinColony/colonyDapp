import { ComponentType, createElement, Component } from 'react';

import { List, Map as ImmutableMap } from 'immutable';

type Props = any;

type Values = any;

type ValueList = List<Values>;

type State = {
  step: number;
  values: ValueList;
};

type StepType = ComponentType<any>;

export type StepsFn<T> = (step: number, values: any, props?: T) => StepType;

type Steps = StepType[] | StepsFn<any>;

type WizardArgs = {
  stepCount?: number;
  steps: Steps;
};

const all = (values: ValueList) =>
  values.reduceRight((map, curr) => map.merge(curr), ImmutableMap()).toJS();

const getStep = (steps: Steps, step: number, values: any, props?: any) =>
  typeof steps === 'function' ? steps(step, values, props) : steps[step];

const withWizard = ({ steps, stepCount: maxSteps }: WizardArgs) => (
  OuterComponent: ComponentType,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0, values: List() };

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

    prev = () => {
      // @ts-ignore
      const { step: currentStep } = this.state;

      /* Inform developer if step has been changed
       * if we are already in the first step there
       * is no way of going back within the wizard
       */
      if (currentStep === 0) {
        return false;
      }
      this.setState(({ step }) => ({ step: step === 0 ? 0 : step - 1 }));
      return true;
    };

    reset = () => {
      this.setState({ step: 0, values: List() });
      this.setValues(List());
    };

    render() {
      const { step, values } = this.state;
      const allValues = all(values);
      const Step = getStep(steps, step, allValues, this.props);

      if (!Step) throw new Error('Step needs to be implemented!');

      const currentStep = step + 1;
      const stepCount = maxSteps || (steps as any).length;

      return createElement(
        OuterComponent,
        {
          // @ts-ignore
          step: currentStep,
          stepCount,
          nextStep: this.next,
          previousStep: this.prev,
          resetWizard: this.reset,
          wizardValues: allValues,
          ...this.props,
        },
        createElement(Step, {
          step: currentStep,
          stepCount,
          nextStep: this.next,
          previousStep: this.prev,
          resetWizard: this.reset,
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
