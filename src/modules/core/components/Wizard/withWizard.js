/* @flow */

import type { ComponentType } from 'react';

import { createElement, Component } from 'react';
import { withFormik } from 'formik';

export type SubmitFn = (values: Object, goodies: Object) => any;

type ValidationSchema = Object;

type Props = {};

type State = {
  step: number,
  values: { [string]: string },
};

type StepType = {
  Step: ComponentType<any>,
  onSubmit: SubmitFn,
  validationSchema?:
    | ValidationSchema
    | (({ [string]: any }) => ValidationSchema),
  formikConfig?: Object,
};

type WizardArgs = {
  steps: Array<StepType>,
  handleFinalSubmit?: (
    values: { [string]: string },
    bag: Object,
  ) => Promise<void> | void,
};

const withWizard = ({ steps }: WizardArgs) => (
  OuterComponent: ComponentType<Object>,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0, values: {} };

    next = (values: { [string]: string }) => {
      this.setState(({ step, values: currentValues }) => ({
        step: steps[step + 1] ? step + 1 : step,
        values: { ...currentValues, ...values },
      }));
    };

    prev = (values: { [string]: string }) => {
      this.setState(({ step, values: currentValues }) => ({
        step: step === 0 ? 0 : step - 1,
        values: { ...currentValues, ...values },
      }));
    };

    handleStepSubmit = (onSubmitFn: SubmitFn) => (
      values: Object,
      bag: Object,
    ) =>
      onSubmitFn(values, {
        nextStep: () => this.next(values),
        previousStep: () => this.prev(values),
        ...bag,
      });

    render() {
      const { step, values: currentValues } = this.state;
      const {
        Step,
        validationSchema,
        onSubmit,
        formikConfig,
        ...extraProps
      } = steps[step];
      const currentStep = step + 1;
      const stepCount = steps.length;
      const Form = ({ values, ...formikProps } = {}) =>
        createElement(
          OuterComponent,
          { step: currentStep, stepCount, ...extraProps },
          createElement(Step, {
            step: currentStep,
            stepCount,
            nextStep: () => this.next(values),
            previousStep: () => this.prev(values),
            values,
            ...formikProps,
          }),
        );
      const WrappedComponent = withFormik({
        handleSubmit: this.handleStepSubmit(onSubmit),
        validationSchema,
        mapPropsToValues: () => currentValues,
        ...formikConfig,
      })(Form);
      return createElement(WrappedComponent, { ...this.props });
    }
  }
  return Wizard;
};

export default withWizard;
