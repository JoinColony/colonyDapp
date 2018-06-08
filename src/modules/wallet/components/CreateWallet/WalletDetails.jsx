/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

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
  subTitle: {
    id: 'CreateWallet.WalletDetails.subTitle',
    defaultMessage:
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
  },
  callToAction: {
    id: 'CreateWallet.WalletDetails.callToAction',
    defaultMessage: 'Need a wallet? Let us help',
  },
  callToActionSub: {
    id: 'CreateWallet.WalletDetails.callToActionSub',
    defaultMessage: 'Create an etherum wallet to join',
  },
});

const rowTitles = defineMessages({
  metaMaskTitle: {
    id: 'CreateWallet.WalletDetails.title1',
    defaultMessage: 'MetaMask',
  },
  hardwareTitle: {
    id: 'CreateWallet.WalletDetails.title2',
    defaultMessage: 'Hardware Wallet',
  },
  phraseTitle: {
    id: 'CreateWallet.WalletDetails.title3',
    defaultMessage: 'Mnemonic Phrase',
  },
  JSONTitle: {
    id: 'CreateWallet.WalletDetails.title4',
    defaultMessage: 'JSON File',
  },
});

const rowSubTitles = defineMessages({
  metaMaskSubtTitle: {
    id: 'CreateWallet.WalletDetails.subTitle1',
    defaultMessage: 'Require MetaMask browser extension',
  },
  hardwareSubtTitle: {
    id: 'CreateWallet.WalletDetails.subTitle2',
    defaultMessage: 'We support Ledger and Trezor',
  },
  phraseSubtTitle: {
    id: 'CreateWallet.WalletDetails.subTitle3',
    defaultMessage: 'Access with your mnemonic phrase',
  },
  JSONSubtTitle: {
    id: 'CreateWallet.WalletDetails.subTitle4',
    defaultMessage: 'We do not recommend this method',
  },
});

const propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  rowIndex: PropTypes.number,
};

const svgStyle = {
  float: 'left',
  marginRight: '22px',
};

const DetailRow = ({ title, subTitle, rowIndex }: Props) => {
  const Icon = icons[rowIndex];
  return (
    <div className={`${styles.row}`}>
      <div className="row-icon">
        <Icon style={svgStyle} />
      </div>
      <Heading appearance={{ size: 'boldSmall' }} text={title} />
      <Heading appearance={{ size: 'tiny' }} text={subTitle} />
    </div>
  );
};

const allTheRows = Object.keys(rowTitles).map((key, i) => {
  const keys = Object.keys(rowSubTitles);
  const title = rowTitles[key];
  const subTitle = rowSubTitles[keys[i]];

  return (
    <NavLink exact to="/">
      <DetailRow
        title={title}
        subTitle={subTitle}
        key={`row${i.toString()}`}
        rowIndex={i}
      />
    </NavLink>
  );
});

const WalletDetails = () => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'thinNormal' }} text={MSG.subTitle} />
    </div>
    {allTheRows}
    <div className={`${styles.callToAction}`}>
      <Heading appearance={{ size: 'boldSmall' }} text={MSG.callToAction} />
      <Heading appearance={{ size: 'tiny' }} text={MSG.callToActionSub} />
    </div>
  </section>
);

DetailRow.propTypes = propTypes;

export default WalletDetails;
