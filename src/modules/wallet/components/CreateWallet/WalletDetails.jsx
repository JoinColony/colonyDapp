/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import styles from './CreateWallet.css';
// import Button from '../../../core/components/Button';
import Heading from '../../../core/components/Heading';
import Icon from '../../../core/components/Icon';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.WalletDetails.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subtitle: {
    id: 'CreateWallet.WalletDetails.subtitle',
    defaultMessage: 'Each Colony',
  },
  callToAction: {
    id: 'CreateWallet.WalletDetails.callToAction',
    defaultMessage: 'Need a wallet? Let us help',
  },
});

const rows = defineMessages({
  0: {
    id: 'CreateWallet.WalletDetails.row1',
    defaultMessage: 'MetaMask',
  },
  1: {
    id: 'CreateWallet.WalletDetails.row2',
    defaultMessage: 'Hardware Wallet',
  },
  2: {
    id: 'CreateWallet.WalletDetails.row3',
    defaultMessage: 'Mnemonic Phrase',
  },
  3: {
    id: 'CreateWallet.WalletDetails.row4',
    defaultMessage: 'JSON File',
  },
});

const propTypes = {
  text: PropTypes.string,
};

const DetailRow = ({ text }: Props) => (
  <div className={`${styles.row}`}>
    <Icon name="metamask" size="medium" />
    <Heading appearance={{ size: 'tiny' }} text={text} />
  </div>
);

const allTheRows = Object.keys(rows).map((row, i) => {
  const message = rows[i];
  return <DetailRow text={message} key="i" />;
});

// Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.
const WalletDetails = () => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'large' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'mediumL' }} text={MSG.subtitle} />
    </div>
    {allTheRows}
    <div className={`${styles.callToAction}`}>
      <FormattedMessage {...MSG.callToAction} />
    </div>
  </section>
);

DetailRow.propTypes = propTypes;

export default WalletDetails;
