/* @flow */

import React from 'react';

import layout from '~styles/layout.css';
import styles from './CreateWallet.css';

const DetailRow = () => <div className={`${styles.row}`}>Row</div>;

const WalletDetails = () => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      How would you like to access Colony?
    </div>
    <div className={`${styles.subtitle}`}>
      Each Colony account is accessed through an associated Ethereum wallet. You
      can use an existing wallet that you own, or create a new wallet below.
    </div>
    <DetailRow />
    <DetailRow />
    <DetailRow />
    <DetailRow />
    <div className={`${styles.callToAction}`}>Need a wallet? Let us help.</div>
  </section>
);

export default WalletDetails;
