/* @flow */

import type { ComponentType } from 'react';
import type { FormikActions } from 'formik';

import { createElement, Component } from 'react';
import { withFormik } from 'formik';

export type SubmitFn<Values> = (
  values: Values,
  goodies: FormikActions<Values> & {
    nextStep: () => void,
    previousStep: () => void,
  },
) => any;

type ValidationSchema = Object;

type Props = {};

type State = {
  step: number,
  values: { [string]: string },
};

type StepType = {
  Step: ComponentType<any>,
  onSubmit: SubmitFn<Object>,
  validationSchema?:
    | ValidationSchema
    | (({ [string]: any }) => ValidationSchema),
  formikConfig?: Object,
};

type StepsFn = (step: number, values: Object) => StepType;

type Steps = Array<StepType> | StepsFn;

type WizardArgs = {
  steps: Steps,
  handleFinalSubmit?: (
    values: { [string]: string },
    bag: Object,
  ) => Promise<void> | void,
};

const getStep = (steps: Steps, step: number, values: Object) => {
  if (typeof steps == 'function') {
    return steps(step, values);
  }
  return steps[step];
};

const withWizard = ({ steps }: WizardArgs) => (
  OuterComponent: ComponentType<Object>,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0, values: {} };

    next = (values: { [string]: string }) => {
      this.setState(({ step, values: currentValues }) => ({
        step: getStep(steps, step + 1, currentValues) ? step + 1 : step,
        values: { ...currentValues, ...values },
      }));
    };

    prev = (values: { [string]: string }) => {
      this.setState(({ step, values: currentValues }) => ({
        step: step === 0 ? 0 : step - 1,
        values: { ...currentValues, ...values },
      }));
    };

    handleStepSubmit = (onSubmitFn: SubmitFn<Object>) => (
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
      } = getStep(steps, step, currentValues);
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
      const mapPropsToValues = props => {
        if (!formikConfig || !formikConfig.mapPropsToValues) {
          return currentValues;
        }
        return {
          ...currentValues,
          ...formikConfig.mapPropsToValues(props),
        };
      };
      const WrappedComponent = withFormik({
        validationSchema,
        ...formikConfig,
        handleSubmit: this.handleStepSubmit(onSubmit),
        mapPropsToValues,
      })(Form);
      return createElement(WrappedComponent, { ...this.props });
    }
  }
  return Wizard;
};

export default withWizard;
