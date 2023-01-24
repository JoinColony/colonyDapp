import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useMediaQuery } from 'react-responsive';

import { WizardProps } from '~core/Wizard';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import DecisionHub from '~core/DecisionHub';
import { Form } from '~core/Fields';
import { multiLineTextEllipsis } from '~utils/strings';

import { query700 as query } from '~styles/queries.css';
import styles from './StepTokenChoice.css';
import { LEARN_MORE_URL } from '~externalUrls';

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
    defaultMessage: `Leia completes a task for 5 FOX in the ShapeShift colony.
    Because FOX is the native token of the ShapeShift colony,
    she also earns 5 reputation in that colony.`,
  },
  button: {
    id: 'dashboard.CreateColonyWizard.StepTokenChoice.button',
    defaultMessage: 'Back',
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
    defaultMessage: 'Add in the list of examples: UNI, SUSHI, & AAVE',
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
    dataTest: 'createNewToken',
  },
  {
    value: 'select',
    title: MSG.selectTokenTitle,
    subtitle: MSG.selectTokenSubtitle,
    icon: 'question-mark',
    tooltip: MSG.tooltipSelect,
    dataTest: 'useExistingToken',
  },
];

interface FormValues {
  tokenChoice: string;
  colonyName: string;
  displayName: string;
}

type Props = WizardProps<FormValues>;

const displayName = 'dashboard.CreateColonyWizard.StepTokenChoice';

const StepTokenChoice = ({ nextStep, wizardForm, wizardValues }: Props) => {
  const isMobile = useMediaQuery({ query });

  return (
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
                  <span title={wizardValues.displayName}>
                    {multiLineTextEllipsis(wizardValues.displayName, 120)}
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
        <DecisionHub name="tokenChoice" options={options} isMobile={isMobile} />
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
};

StepTokenChoice.displayName = displayName;

export default StepTokenChoice;
