/* @flow */
/* eslint-disable react/no-unused-prop-types */

import type { ComponentType } from 'react';
import type { FormikBag } from 'formik';

import { createElement, Component } from 'react';

import { ActionForm, Form } from '~core/Fields';

import type { SubmitFn, ActionSubmit } from './types';

type ValidationSchema = Object;

type Props = {};

type AnyValues = { [string]: any };

type State = {
  step: number,
  values: AnyValues,
};

type StepType = {
  Step: ComponentType<any>,
  onSubmit: SubmitFn<AnyValues> | ActionSubmit<AnyValues>,
  validationSchema?:
    | ValidationSchema
    | (({ [string]: any }) => ValidationSchema),
  formikConfig?: Object,
};

type StepsFn = (step: number, values: Object) => StepType;

type Steps = Array<StepType> | StepsFn;

type WizardArgs = {
  stepCount?: number,
  steps: Steps,
};

type SetSubmitting = (isSubmitting: boolean) => void;

const getStep = (steps: Steps, step: number, values: Object) => {
  if (typeof steps == 'function') {
    return steps(step, values);
  }
  return steps[step];
};

const withWizard = ({ steps, stepCount: maxSteps }: WizardArgs) => (
  OuterComponent: ComponentType<Object>,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0, values: {} };

    next = (values: AnyValues, setSubmitting: SetSubmitting) => {
      setSubmitting(false);
      this.setState(({ step, values: currentValues }) => ({
        step: step + 1,
        values: { ...currentValues, ...values },
      }));
    };

    prev = (values: AnyValues, setSubmitting: SetSubmitting) => {
      setSubmitting(false);
      this.setState(({ step, values: currentValues }) => ({
        step: step === 0 ? 0 : step - 1,
        values: { ...currentValues, ...values },
      }));
    };

    extendBag = (values: AnyValues, bag: FormikBag<Object, AnyValues>) => ({
      ...bag,
      nextStep: () => this.next(values, bag.setSubmitting),
      previousStep: () => this.prev(values, bag.setSubmitting),
    });

    handleStepSubmit = (onSubmitFn: SubmitFn<AnyValues>) => (
      values: Object,
      bag: Object,
    ) => onSubmitFn(values, this.extendBag(values, bag));

    handleActionSubmit = ({
      onSuccess,
      onError,
      ...rest
    }: ActionSubmit<AnyValues>) => {
      const { values } = this.state;
      const extendedActionSubmit = {
        ...rest,
        onSuccess: onSuccess
          ? (res: any, bag: FormikBag<Object, AnyValues>) =>
              onSuccess(res, this.extendBag(values, bag))
          : undefined,
        onError: onError
          ? (res: any, bag: FormikBag<Object, AnyValues>) =>
              onError(res, this.extendBag(values, bag))
          : undefined,
      };
      return extendedActionSubmit;
    };

    render() {
      const { step, values: currentValues } = this.state;
      const {
        Step,
        validationSchema,
        onSubmit,
        formikConfig,
        ...extraProps
      } = getStep(steps, step, currentValues);

      if (!Step) {
        throw new Error('Step needs to be implemented!');
      }

      if (!onSubmit) {
        throw new Error('onSubmit needs to be implemented!');
      }

      const currentStep = step + 1;
      const stepCount = maxSteps || steps.length;

      const configInitialValues = formikConfig
        ? formikConfig.initialValues
        : {};

      const initialValues = {
        ...currentValues,
        ...configInitialValues,
      };

      const FormComponent = typeof onSubmit == 'function' ? Form : ActionForm;
      const submitProps =
        typeof onSubmit == 'function'
          ? { onSubmit: this.handleStepSubmit(onSubmit) }
          : this.handleActionSubmit(onSubmit);

      return createElement(
        OuterComponent,
        { step: currentStep, stepCount, ...extraProps, ...this.props },
        createElement(
          FormComponent,
          {
            ...formikConfig,
            ...submitProps,
            validationSchema,
            initialValues,
          },
          ({ values, ...formikProps }) =>
            createElement(Step, {
              step: currentStep,
              stepCount,
              nextStep: () => this.next(values, formikProps.setSubmitting),
              previousStep: () => this.prev(values, formikProps.setSubmitting),
              values,
              ...formikProps,
            }),
        ),
      );
    }
  }
  return Wizard;
};

export default withWizard;
