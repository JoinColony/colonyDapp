/* @flow */

import React from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';

import layout from '~styles/layout.css';

import Logo from '../../../../img/icons/logo.svg';
import ProgressBar from '../../../core/components/ProgressBar';
import styles from './WizardTemplateCentered.css';

type Props = {
  children: Node,
  step: PropTypes.number,
  stepCount: PropTypes.number,
};

const displayName = 'pages.WizardTemplate';

const WizardTemplate = ({ children, step, stepCount }: Props) => (
  <main className={`${layout.stretchHorizontal}`}>
    <header className={styles.header}>
      <figure className={styles.logo} role="presentation">
        <Logo />
      </figure>
        { step != 0 ? (
            <ProgressBar step={step} stepCount={stepCount} />
        ) : (
          undefined
        )}
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
