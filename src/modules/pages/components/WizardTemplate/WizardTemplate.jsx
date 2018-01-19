/* @flow */

import React from 'react';
import type { Node } from 'react';

import layout from '$styles/layout.css';

import IMG_LOGO from '../../../../img/logo.svg';
import styles from './WizardTemplate.css';

type Props = {
  children: Node,
  sidebarChild?: Node,
};

const displayName = 'pages.WizardTemplate';

const WizardTemplate = ({ children, sidebarChild }: Props) => (
  <main
    className={`${layout.flexContainerRow} ${layout.stretch} ${styles.main}`}
  >
    <aside className={styles.sidebar}>
      <section className={styles.sidebarContent}>
        <figure className={styles.logo} role="presentation">
          <svg viewBox="0 0 160 80">
            <image href={IMG_LOGO} x="0" y="0" width="160" height="80" />
          </svg>
        </figure>
        {sidebarChild &&
          <div className={styles.sidebarChild}>
            {sidebarChild}
          </div>
        }
      </section>
    </aside>
    <article
      className={`${layout.flexContent} ${layout.flexContainerRow} ${layout.flexAlignCenter} ${styles.content}`}
    >
      {children}
    </article>
  </main>
);

WizardTemplate.displayName = displayName;

export default WizardTemplate;
