/* @flow */

import React from 'react';
import type { Node } from 'react';

import Logo from '../../../img/logo.svg';
import { StepBar } from '../../core/components/ProgressBar';
import styles from './WizardTemplate.css';

type Props = {
  children: Node,
  step?: number,
  stepCount?: number,
  /* When internal is true it means that this would be a screen that's been shown after logging in */
  internal: boolean,
};

const displayName = 'pages.WizardTemplate';

const WizardTemplate = ({ children, step, stepCount, internal }: Props) => (
  <main className={styles.layoutMain}>
    {internal && (
      <header className={styles.header}>
        <figure className={styles.logo} role="presentation">
          <Logo />
        </figure>
        {stepCount &&
          step && (
            <div className={styles.stepBarContainer}>
              <StepBar step={step} stepCount={stepCount} />
            </div>
          )}
      </header>
    )}
    <article className={styles.content}>{children}</article>
  </main>
);

WizardTemplate.displayName = displayName;

export default WizardTemplate;
