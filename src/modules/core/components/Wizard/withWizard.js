/* @flow */

import type { ComponentType } from 'react';

import { createElement, useState, useCallback } from 'react';
import { List, Map as ImmutableMap } from 'immutable';

type Props = {};

type Values = { [formValue: string]: any };

type ValueList = List<Values>;

type StepType = ComponentType<any>;

type StepsFn<T> = (step: number, values: Values, props?: T) => StepType;

type Steps = Array<StepType> | StepsFn<Object>;

type WizardArgs = {
  stepCount?: number,
  steps: Steps,
};

const all = (values: ValueList) =>
  values.reduce((map, curr) => map.merge(curr), ImmutableMap()).toJS();

const getStep = (steps: Steps, step: number, values: Object, props?: Object) =>
  typeof steps == 'function' ? steps(step, values, props) : steps[step];

const withWizard = ({ steps, stepCount: maxSteps }: WizardArgs) => (
  OuterComponent: ComponentType<Object>,
) => (props: Props) => {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(new List());

  const next = useCallback(
    (newValues: Values) => {
      setStep(step + 1);
      setValues(values.set(step, newValues));
    },
    [step, values],
  );

  // TODO: when going back we could instead store the isValid state of the form when going back
  const prev = useCallback(
    (newValues?: Values) => {
      setStep(step === 0 ? 0 : step - 1);
      // Going back we only want to set values when we actually have some
      setValues(
        values && Object.keys(newValues).length
          ? values.set(step, newValues)
          : values,
      );
    },
    [step, setStep, setValues, values],
  );

  const allValues = all(values);
  const Step = getStep(steps, step, allValues, props);

  if (!Step) throw new Error('Step needs to be implemented!');

  const currentStep = step + 1;
  const stepCount = maxSteps || steps.length;

  return createElement(
    OuterComponent,
    {
      step: currentStep,
      stepCount,
      nextStep: next,
      previousStep: prev,
      wizardValues: allValues,
      ...props,
    },
    createElement(Step, {
      step: currentStep,
      stepCount,
      nextStep: next,
      previousStep: prev,
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
};

export default withWizard;
