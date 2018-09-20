/* @flow */

import React from 'react';

import { defineMessages } from 'react-intl';

import styles from './TokenChoice.css';

import WizardTemplate from '../../../pages/WizardTemplate';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import DecisionHub from '../../../core/components/DecisionHub';

import type { SubmitFn } from '../../../core/components/Wizard';

type FormValues = {
  targetStep: number,
  nextStep: () => void,
};

type Props = {
  previousStep: () => void,
};

const MSG = defineMessages({
  heading: {
    id: 'TokenChoice.heading',
    defaultMessage: `Would you like to create
      a new token or use an existing ERC20 token?`,
  },
  subTitle: {
    id: 'TokenChoice.subTitle',
    defaultMessage: `Each Colony has a native token.
      When rewarding contributors with the native token,
      those users will also earn reputation in your Colony.`,
  },
  subTitleWithLink: {
    id: 'TokenChoice.subTitleWithLink',
    defaultMessage: 'Not sure which option to choose?',
  },
  button: {
    id: 'TokenChoice.button',
    defaultMessage: 'Back',
  },
  learnMore: {
    id: 'TokenChoice.learnMore',
    defaultMessage: 'Learn More',
  },
});

const rowTitles = defineMessages({
  metaMaskTitle: {
    id: 'TokenChoice.newToken',
    defaultMessage: 'Create a new token',
  },
  hardwareTitle: {
    id: 'TokenChoice.existingToken',
    defaultMessage: 'Use an existing ERC20 token',
  },
});

const rowSubTitles = defineMessages({
  metaMaskSubtTitle: {
    id: 'TokenChoice.newTokenSubtitle',
    defaultMessage: 'Earn reputation for your tasks',
  },
  hardwareSubtTitle: {
    id: 'TokenChoice.existingTokenSubtitle',
    defaultMessage: 'For example: DAI, EOS, SNT, etc',
  },
});

const TokenChoice = ({ previousStep }: Props) => (
  <WizardTemplate>
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
            type="continue"
            text={MSG.learnMore}
          />
        </div>
      </div>
      {
        <DecisionHub
          rowTitles={rowTitles}
          rowSubTitles={rowSubTitles}
          choices={{ new: 2, existing: 3 }}
        />
      }
      <div className={styles.buttonContainer}>
        <Button
          appearance={{ theme: 'secondary' }}
          type="cancel"
          text={MSG.button}
          onClick={previousStep}
        />
      </div>
    </section>
  </WizardTemplate>
);

export const Step = TokenChoice;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
