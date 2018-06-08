/* @flow */

import React from 'react';
import type { Node } from 'react';

import layout from '~styles/layout.css';

import Logo from '../../../../img/logo.svg';
import styles from './WizardTemplateCentered.css';

type Props = {
  children: Node,
};

const displayName = 'pages.WizardTemplate';

const WizardTemplate = ({ children }: Props) => (
  <main className={`${layout.stretchHorizontal}`}>
    <header className={styles.header}>
      <figure className={styles.logo} role="presentation">
        <Logo />
      </figure>
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
