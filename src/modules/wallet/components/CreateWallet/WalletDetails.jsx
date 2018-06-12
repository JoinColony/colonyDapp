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
import ArrowRight from '../../../../img/icons/arrow.svg';

import jazz from '../../../../img/jazz.png';

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

const propTypesDetails = {
  nextStep: PropTypes.func,
};

const svgStyle = {
  width: '22px',
  height: '22px',
};

const DetailRow = ({ title, subTitle, rowIndex }: Props) => {
  const Icon = icons[rowIndex];
  return (
    <div className={`${styles.row}`}>
      <div className={`${styles.rowIcon}`}>
        <Icon style={svgStyle} />
      </div>
      <div className={`${styles.rowContent}`}>
        <Heading appearance={{ size: 'boldSmall' }} text={title} />
        <Heading appearance={{ size: 'tiny' }} text={subTitle} />
      </div>
      <ArrowRight className={`${styles.rowArrow}`} />
    </div>
  );
};

const allTheRows = Object.keys(rowTitles).map((key, i) => {
  const keys = Object.keys(rowSubTitles);
  const title = rowTitles[key];
  const subTitle = rowSubTitles[keys[i]];

  return (
    <NavLink key={`Link${i.toString()}`} exact to="/">
      <DetailRow
        title={title}
        subTitle={subTitle}
        key={`row${i.toString()}`}
        rowIndex={i}
      />
    </NavLink>
  );
});

const WalletDetails = ({ nextStep, handleSubmit, submitting }: Props) => {
  return (
    <section className={`${styles.content}`}>
      <div className={`${styles.title}`}>
        <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
      </div>
      <div className={`${styles.subtitle}`}>
        <Heading appearance={{ size: 'thinNormal' }} text={MSG.subTitle} />
      </div>
      {allTheRows}
      <div className={`${styles.callToAction}`}>
        <div className={`${styles.actionImage}`}>
          <img src={jazz} alt="" className="emoticon" width="25" height="25" />
        </div>
        <div className={`${styles.actionText}`}>
          <Heading appearance={{ size: 'boldSmall' }} text={MSG.callToAction} />
          <Heading appearance={{ size: 'tiny' }} text={MSG.callToActionSub} />
        </div>
        <ArrowRight
          className={`${styles.rowArrow}`}
          onClick={handleSubmit(nextStep)}
        />
      </div>
    </section>
  );
};

DetailRow.propTypes = propTypes;
WalletDetails.propTypes = propTypesDetails;

export default WalletDetails;
