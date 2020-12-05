import { ComponentType } from 'react';

import { useDialog, DialogType } from '~core/Dialog';
import { isDev } from '~utils/debug';

type PotentialProps = Record<string, any>;

interface Step {
  component: ComponentType<any>;
  props?: PotentialProps;
}

type Steps = Step[];

type CallStepFnSignature = (dialogName: string) => void;

export type WizardDialogType<P> = DialogType<P | undefined> & {
  callStep: CallStepFnSignature;
};

interface WizardComponent {
  component: <P extends object>(potentialProps?: P) => WizardDialogType<P>;
  props?: PotentialProps;
}

type WizardMap = Record<string, WizardComponent>;

const createWizardMap = (potentialWizardSteps: Steps): WizardMap => {
  const wizardMap = {};
  potentialWizardSteps.map((potentialWizardStep, index) => {
    const { component, props = {} } = potentialWizardStep;
    const componentName = component.displayName || `Component${index}`;
    wizardMap[componentName] = {
      component: useDialog(component),
      props,
    };
    return null;
  });
  return wizardMap;
};

/*
 * @NOTE Initial implementation of a flow-less dialog wizard
 *
 * The idea behind this, is that it injects a `callStep` method in each
 * initial declared step, with which, you can reference and call each other
 * step in the registered wizard.
 *
 * This way it doesn't matter if you want to skip one step, or two, or to a
 * different flow entirely. The wizard doesn't care, since it's not linear anymore.
 *
 * Currently it doesn't support passing state between dialog calls, but that can
 * be very easily added if required.
 *
 * Note that for this work properly, each component mush have a `displayName` value
 * otherwise it will be very hard to call the component by name.
 */
const useNaiveBranchingDialogWizard = (steps: Steps) => {
  const wizardMap = createWizardMap(steps);

  const callDialogStep = (componentName: string) => {
    const callableComponent = wizardMap[componentName];
    if (!callableComponent) {
      /*
       * @NOTE This means we can't find the component by name
       * Most likely it's a typo when calling it from within the dialog step
       * We log an error, but only if we're in dev mode
       */
      if (isDev || process.env.DEV) {
        console.error(
          `Could not find Component: "${componentName}".`,
          'Check the arguments passed to "callStep()".',
        );
      }
      return null;
    }
    const { close } = callableComponent.component({
      ...callableComponent.props,
      callStep: (dialogName: string) => {
        close(null);
        callDialogStep(dialogName);
      },
    });
    return null;
  };

  return callDialogStep;
};

export default useNaiveBranchingDialogWizard;
