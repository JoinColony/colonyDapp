/* @flow */

import { createElement, Component } from 'react';
import type { ComponentType } from 'react';
import { reduxForm } from 'redux-form';

type Props = {};

type State = {
  step: number,
};

type StepType = {
  Step: ComponentType<any>,
  validate?: () => Object,
};

type WizardArgs = {
  form: string,
  steps: Array<StepType>,
  reduxFormOpts?: Object,
};

const withWizard = ({ steps, form, reduxFormOpts }: WizardArgs) => (
  OuterComponent: ComponentType<any>,
) => {
  class Wizard extends Component<Props, State> {
    state = { step: 0 };

    next = () => {
      const { step } = this.state;
      this.setState({
        step: steps[step + 1] ? step + 1 : step,
      });
    };

    prev = () => {
      const { step } = this.state;
      this.setState({
        step: step === 0 ? 0 : step - 1,
      });
    };

    render() {
      const { step: currentStep } = this.state;
      const { Step, validate, ...extraProps } = steps[currentStep];
      const WrappedStep = reduxForm({
        ...reduxFormOpts,
        form,
        validate,
        destroyOnUnmount: false,
      })(Step);
      const WizardStep = createElement(WrappedStep, {
        nextStep: this.next,
        previousStep: this.prev,
      });
      return createElement(
        OuterComponent,
        { step: this.state.step, stepCount: steps.length, ...extraProps },
        WizardStep,
      );
    }
  }
  return Wizard;
};

export default withWizard;
