/* @flow */

import React from 'react';

import { defineMessages } from 'react-intl';

import styles from './StepTokenChoice.css';

import Heading from '~components/core/Heading';
import Button from '~components/core/Button';
import DecisionHub from '~components/core/DecisionHub';
import { Form } from '~components/core/Fields';

import type { WizardProps } from '~components/core/Wizard';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.heading',
    defaultMessage:
      /* eslint-disable max-len */
      'How would you like to create a new token or use an existing ERC20 token?',
  },
  subTitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony has a native token. When rewarding contributors with the native token, those users will also earn reputation in your Colony.',
  },
  subTitleWithLink: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subTitleWithLink',
    defaultMessage: 'Not sure which option to choose?',
  },
  button: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.button',
    defaultMessage: 'Back',
  },
  learnMore: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.learnMore',
    defaultMessage: 'Learn More',
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
    defaultMessage: 'Earn reputation for your tasks',
  },
  selectTokenSubtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.existingTokenSubtitle',
    defaultMessage: 'For example: DAI, EOS, SNT, etc',
  },
});

const options = [
  {
    value: 'create',
    title: MSG.createTokenTitle,
    subtitle: MSG.createTokenSubtitle,
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
  },
];

type FormValues = {
  tokenChoice: string,
};

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepTokenChoice';

const StepTokenChoice = ({ nextStep, previousStep, wizardForm }: Props) => (
  <Form onSubmit={nextStep} {...wizardForm}>
    {({ values }) => (
      <section className={styles.content}>
        <div className={styles.title}>
          <Heading
            appearance={{ size: 'medium', weight: 'thin' }}
            text={MSG.heading}
          />
        </div>
        <div className={styles.subtitle}>
          <Heading
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subTitle}
          />
        </div>
        <div className={styles.subtitleWithLinkBox}>
          <Heading
            className={styles.subtitleWithLink}
            appearance={{ size: 'normal', weight: 'thin' }}
            text={MSG.subTitleWithLink}
          />
          <div className={styles.link}>
            <Button
              appearance={{ theme: 'blue' }}
              type="button"
              text={MSG.learnMore}
            />
          </div>
        </div>
        <DecisionHub name="tokenChoice" options={options} />
        <div className={styles.buttonContainer}>
          <Button
            appearance={{ theme: 'secondary' }}
            type="button"
            text={MSG.button}
            onClick={() => previousStep(values)}
          />
        </div>
      </section>
    )}
  </Form>
);

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
