import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../../../img/logo.svg';
import { StepBar } from '~core/ProgressBar';
import styles from './WizardTemplate.css';

interface Props {
  children: ReactNode;
  step?: number;
  stepCount?: number;
}

const displayName = 'pages.WizardTemplate';

const WizardTemplate = ({ children, step, stepCount }: Props) => (
  <main className={styles.layoutMain}>
    <header className={styles.header}>
      <figure className={styles.logo} role="presentation">
        <Link to="/">
          <Logo />
        </Link>
      </figure>
      {stepCount && step && (
        <div className={styles.stepBarContainer}>
          <StepBar step={step} stepCount={stepCount} />
        </div>
      )}
    </header>
    <article className={styles.content}>{children}</article>
  </main>
);

WizardTemplate.displayName = displayName;

export default WizardTemplate;
