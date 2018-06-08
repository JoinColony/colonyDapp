/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import styles from './CreateWallet.css';
import Heading from '../../../core/components/Heading';
import MetaMask from '../../../../img/icons/metamask.svg';
import Wallet from '../../../../img/icons/wallet.svg';
import Phrase from '../../../../img/icons/phrase.svg';
import File from '../../../../img/icons/file.svg';

const icons = [MetaMask, Wallet, Phrase, File];

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.WalletDetails.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subtitle: {
    id: 'CreateWallet.WalletDetails.subtitle',
    defaultMessage:
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
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
  rowIndex: PropTypes.number,
};

const svgStyle = {
  float: 'left',
  marginRight: '22px',
};

const DetailRow = ({ text, rowIndex }: Props) => {
  const Icon = icons[rowIndex];
  return (
    <div className={`${styles.row}`}>
      <div className="row-icon">
        <Icon style={svgStyle} />
      </div>
      <Heading appearance={{ size: 'boldSmall' }} text={text} />
      <Heading appearance={{ size: 'tiny' }} text={text} />
    </div>
  );
};

const allTheRows = Object.keys(rows).map((row, i) => {
  const message = rows[i];
  return <DetailRow text={message} key={i} rowIndex={i} />;
});

const WalletDetails = () => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'normal' }} text={MSG.subtitle} />
    </div>
    {allTheRows}
    <div className={`${styles.callToAction}`}>
      <Heading appearance={{ size: 'boldSmall' }} text={MSG.callToAction} />
      <Heading appearance={{ size: 'tiny' }} text={MSG.callToAction} />
    </div>
  </section>
);

DetailRow.propTypes = propTypes;

export default WalletDetails;
