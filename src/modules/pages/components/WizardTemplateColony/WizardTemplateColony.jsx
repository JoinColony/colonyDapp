/* @flow */
import type { Node } from 'react';

import React from 'react';

import { StepBar } from '~core/ProgressBar';
import { HistoryNavigation } from '~pages/NavigationWrapper';

import styles from './WizardTemplateColony.css';

type Props = {|
  children: Node,
  step?: number,
  stepCount?: number,
  previousStep: () => void,
|};

const displayName = 'pages.WizardTemplateColony';

const WizardTemplateColony = ({ children, step, stepCount, previousStep }: Props) => (
  <main className={styles.layoutMain}>
    <header className={styles.header}>
      <div className={styles.backButton}>
        <HistoryNavigation noText customHandler={previousStep} />
      </div>
      {stepCount && step && (
        <div className={styles.steps}>
          <StepBar step={step} stepCount={stepCount} />
        </div>
      )}
    </header>
    <article className={styles.content}>{children}</article>
  </main>
);

WizardTemplateColony.displayName = displayName;

export default WizardTemplateColony;
