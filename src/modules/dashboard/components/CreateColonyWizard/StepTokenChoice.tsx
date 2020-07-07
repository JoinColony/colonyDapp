import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WizardProps } from '~core/Wizard';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import DecisionHub from '~core/DecisionHub';
import { Form } from '~core/Fields';
import { multiLineTextEllipsis } from '~utils/strings';
import ENS from '~lib/ENS';

import styles from './StepTokenChoice.css';

const LEARN_MORE_URL =
  // eslint-disable-next-line max-len
  'https://help.colony.io/hc/en-us/articles/360024589073-How-to-choose-a-native-token';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.heading',
    defaultMessage: 'Choose a native token for {colony}',
  },
  subtitle: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subtitle',
    defaultMessage: `You earn reputation in a colony when it pays you in its\
      native token.`,
  },
  subtitleWithExample: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.subtitleWithExample',
    defaultMessage: `Example: Leia completes a task for 5 DAI. If the colony\
      uses DAI as its native token, she also earns 5 reputation in that\
      colony.`,
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
    defaultMessage:
      // eslint-disable-next-line max-len
      "Good for projects that don't already have a token or who want more control over their token",
  },
  tooltipSelect: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.tooltipSelect',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Good for projects that already have their own token or want to use an existing one like DAI.',
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

interface FormValues {
  tokenChoice: string;
  colonyName: string;
}

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepTokenChoice';

const StepTokenChoice = ({ nextStep, wizardForm, wizardValues }: Props) => (
  <Form onSubmit={nextStep} {...wizardForm}>
    <section className={styles.content}>
      <div className={styles.title}>
        <Heading appearance={{ size: 'medium', weight: 'bold' }}>
          <FormattedMessage
            {...MSG.heading}
            values={{
              /*
               * @NOTE We need to use a JS string truncate here, rather then CSS,
               * since we're dealing with a string that needs to be truncated,
               * inside a sentence that does not
               */
              colony: (
                <span title={ENS.normalizeAsText(wizardValues.colonyName)}>
                  {multiLineTextEllipsis(
                    ENS.normalizeAsText(wizardValues.colonyName),
                    29,
                  )}
                </span>
              ),
            }}
          />
        </Heading>
      </div>
      <div className={styles.subtitle}>
        <Heading
          appearance={{ size: 'normal', weight: 'thin' }}
          text={MSG.subtitle}
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
        <ExternalLink
          className={styles.link}
          text={{ id: 'text.learnMore' }}
          href={LEARN_MORE_URL}
        />
      </div>
    </section>
  </Form>
);

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
