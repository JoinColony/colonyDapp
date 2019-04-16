/* @flow */

import React from 'react';

import { defineMessages } from 'react-intl';

import styles from './StepTokenChoice.css';

import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import DecisionHub from '~core/DecisionHub';
import { Form } from '~core/Fields';

import type { WizardProps } from '~core/Wizard';

import { getNormalizedDomainText } from '~utils/strings';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.heading',
    defaultMessage:
      /* eslint-disable max-len */
      'Choose a native token for {colony}',
  },
  subtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subtitle',
    defaultMessage:
      /* eslint-disable max-len */
      `Colonies need a native token to calculate reputation at the end of a task.
      Choose which token is right for {colony}.`,
  },
  subtitleWithExample: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subtitleWithExample',
    defaultMessage: `E.g.: Leia has completed a task worth 1.5 ETH and 5 CLNY.
      If CLNY is the native token then she also earns +5 reputation points.`,
  },
  button: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.button',
    defaultMessage: 'Back',
  },
  learnMore: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.learnMore',
    defaultMessage: 'Learn More',
  },
  notSure: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.notSure',
    defaultMessage: 'Not sure?',
  },
  createTokenTitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.newToken',
    defaultMessage: 'Create a new token',
  },
  selectTokenTitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.existingToken',
    defaultMessage: 'Use an existing ERC20 token',
  },
  createTokenSubtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.newTokenSubtitle',
    defaultMessage: 'For example: MyAwesomeToken',
  },
  selectTokenSubtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.existingTokenSubtitle',
    defaultMessage: 'For example: DAI, EOS, SNT, etc',
  },
  tooltipCreate: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.tooltipCreate',
    defaultMessage: `You’ll be able to mint new tokens at any time.
      Good for new projects or projects that want more control over their tokens.`,
  },
  tooltipSelect: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.tooltipSelect',
    defaultMessage: `Use a token that already has some value.
      Good for established projects or projects wanting to use existing market forces.`,
  },
});

const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltipCreate,
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltipSelect,
  },
];

type FormValues = {
  tokenChoice: string,
  colonyName: string,
};

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepTokenChoice';

const StepTokenChoice = ({ nextStep, wizardForm, wizardValues }: Props) => (
  <Form onSubmit={nextStep} {...wizardForm}>
    {
      <section className={styles.content}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'medium' }}
            text={MSG.heading}
            textValues={{
              colony: getNormalizedDomainText(wizardValues.colonyName),
            }}
          />
        </div>
        <div className={styles.subtitle}>
          <Heading
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subtitle}
            textValues={{ colony: wizardValues.colonyName }}
          />
        </div>
        <div className={styles.subtitleWithExampleBox}>
          <Heading
            className={styles.subtitleWithExample}
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subtitleWithExample}
          />
        </div>
        <DecisionHub name="tokenChoice" options={options} />
        <div className={styles.titleAndButton}>
          <Heading
            appearance={{
              size: 'tiny',
              weight: 'bold',
              margin: 'none',
            }}
            text={MSG.notSure}
          />
          <ExternalLink className={styles.link} text={MSG.learnMore} href="#" />
        </div>
      </section>
    }
  </Form>
);

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
