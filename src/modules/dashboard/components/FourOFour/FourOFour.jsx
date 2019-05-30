/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Logo from '../../../../img/logo.svg';
import Icon from '~core/Icon';
import Heading from '~core/Heading';

import styles from './FourOFour.css';

const MSG = defineMessages({
  message: {
    id: 'dashboard.message',
    defaultMessage:
      'Something went wrong! Have you tried turning it off and on again?',
  },
  nakedMole: {
    id: 'dashboard.nakedMole',
    defaultMessage: 'Naked Mole',
  },
  fourOFour: {
    id: 'dashboard.fourOFour',
    defaultMessage: '404!',
  },
});

const displayName = 'dashboard.FourOFour';

const FourOFour = () => (
  <main className={styles.layoutMain}>
    <header className={styles.header}>
      <figure className={styles.logo} role="presentation">
        <Link to="/">
          <Logo />
        </Link>
      </figure>
    </header>
    <div className={styles.herowrapper}>
      <div className={styles.title}>
        <Heading
          appearance={{ size: 'medium', weight: 'medium', margin: 'none' }}
          text={MSG.fourOFour}
        />
      </div>
      <p className={styles.description}>
        <FormattedMessage {...MSG.message} />
      </p>
      <div className={styles.hero}>
        <Icon
          name="naked-mole"
          title={MSG.nakedMole}
          appearance={{ size: 'image' }}
        />
      </div>
    </div>
  </main>
);

FourOFour.displayName = displayName;

export default FourOFour;
