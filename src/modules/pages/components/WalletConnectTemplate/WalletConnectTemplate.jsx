/* @flow */
import React, { Fragment } from 'react';
import type { Node } from 'react';

import { Link } from 'react-router-dom';

import Logo from '../../../../img/icons/logo.svg';
import styles from './WalletConnectTemplate.css';

type Props = {
  children: Node,
}

const WalletConnectTemplate = ({children}: Props) => (
  <Fragment>
    <header className={styles.header}>
      <figure className={styles.logo} role="presentation">
        <Link to="/">
          <Logo />
        </Link>
      </figure>
    </header>
    <div className={styles.mainContent}>
      <div>
        {children}
      </div>
    </div>
  </Fragment>
);

export default WalletConnectTemplate;