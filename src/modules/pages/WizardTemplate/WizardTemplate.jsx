/* @flow */
import type { Node } from 'react';

import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../../img/logo.svg';
import { StepBar } from '../../core/components/ProgressBar';
import styles from './WizardTemplate.css';

type Props = {
  children: Node,
  step?: number,
  stepCount?: number,
  /* When internal is true it means that this would be a screen that's been shown after logging in */
  external?: boolean,
};

const displayName = 'pages.WizardTemplate';

const WizardTemplate = ({ children, step, stepCount, external }: Props) => (
  <main className={styles.layoutMain}>
    {!external && (
      <header className={styles.header}>
        <figure className={styles.logo} role="presentation">
          <Link to="/">
            <Logo />
          </Link>
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
