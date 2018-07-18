/* @flow */

import React from 'react';
import type { Node } from 'react';
import layout from '~styles/layout.css';

import Logo from '../../../img/logo.svg';
import { StepBar } from '../../core/components/ProgressBar';
import styles from './WizardTemplate.css';

type Props = {
  children: Node,
  step: number,
  stepCount: number,
};

const displayName = 'pages.WizardTemplate';

const WizardTemplate = ({ children, step, stepCount }: Props) => (
  <main className={layout.stretchHorizontal}>
    <header className={styles.header}>
      <figure className={styles.logo} role="presentation">
        <Logo />
      </figure>
      <div className={styles.stepBarContainer}>
        {step && <StepBar step={step} stepCount={stepCount} />}
      </div>
    </header>
    <article
      className={`${layout.flexContainerColumn} ${layout.flexAlignCenter} ${
        styles.content
      }`}
    >
      {children}
    </article>
  </main>
);

WizardTemplate.displayName = displayName;

export default WizardTemplate;
