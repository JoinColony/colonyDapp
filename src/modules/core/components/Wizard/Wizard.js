/* @flow */

import { createElement, Component } from 'react';
import type { ComponentType } from 'react';
import { reduxForm } from 'redux-form';

type WizardProps = {};

type WizardState = {
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
  class Wizard extends Component<WizardProps, WizardState> {
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
      const { Step, validate, ...extraProps } = steps[this.state.step];
      const WrappedStep = reduxForm({
        ...reduxFormOpts,
        form,
        validate,
        destroyOnUnmount: false,
      })(Step);
      return createElement(
        OuterComponent,
        { ...extraProps },
        createElement(WrappedStep, {
          nextStep: this.next,
          previousStep: this.prev,
        }),
      );
    }
  }
  return Wizard;
};

export default withWizard;
