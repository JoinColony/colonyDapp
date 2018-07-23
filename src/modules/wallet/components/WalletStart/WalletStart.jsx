/* @flow */

// FIXME: This should not be a step. This should be an own route (like /acccess?), which then links to
// /unlockwallet and /createwallet
import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import { defineMessages } from 'react-intl';
import { NavLink } from 'react-router-dom';

import styles from './WalletStart.css';

import WizardTemplate from '../../../pages/WizardTemplate';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

// TODO: Icon component
import MetaMask from '../../../../img/icons/metamask.svg';
import Wallet from '../../../../img/icons/wallet.svg';
import Phrase from '../../../../img/icons/phrase.svg';
import File from '../../../../img/icons/file.svg';
import ArrowRight from '../../../../img/icons/arrow.svg';
import jazz from '../../../../img/icons/jazz.png';

const icons = [MetaMask, Wallet, Phrase, File];

const MSG = defineMessages({
  heading: {
    id: 'WalletStart.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subTitle: {
    id: 'WalletStart.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
  },
  callToAction: {
    id: 'WalletStart.callToAction',
    defaultMessage: 'Need a wallet? Let us help',
  },
  callToActionSub: {
    id: 'WalletStart.callToActionSub',
    defaultMessage: 'Create an etherum wallet to join',
  },
});

const rowTitles = defineMessages({
  metaMaskTitle: {
    id: 'WalletStart.metaMaskTitle',
    defaultMessage: 'MetaMask',
  },
  hardwareTitle: {
    id: 'WalletStart.hardwareTitle',
    defaultMessage: 'Hardware Wallet',
  },
  phraseTitle: {
    id: 'WalletStart.phraseTitle',
    defaultMessage: 'Mnemonic Phrase',
  },
  JSONTitle: {
    id: 'WalletStart.JSONTitle',
    defaultMessage: 'JSON File',
  },
});

const rowSubTitles = defineMessages({
  metaMaskSubtTitle: {
    id: 'WalletStart.metaMaskSubtitle',
    defaultMessage: 'Require MetaMask browser extension',
  },
  hardwareSubtTitle: {
    id: 'WalletStart.hardwareSubtitle',
    defaultMessage: 'We support Ledger and Trezor',
  },
  phraseSubtTitle: {
    id: 'WalletStart.phraseSubtitle',
    defaultMessage: 'Access with your mnemonic phrase',
  },
  JSONSubtTitle: {
    id: 'WalletStart.JSONSubtitle',
    defaultMessage: 'We do not recommend this method',
  },
});

type RowProps = {
  title: MessageDescriptor,
  subTitle: MessageDescriptor,
  rowIndex: number,
};

const svgStyle = {
  width: '22px',
  height: '22px',
};

const DetailRow = ({ title, subTitle, rowIndex }: RowProps) => {
  const Icon = icons[rowIndex];
  return (
    <div className={styles.row}>
      <div className={styles.rowIcon}>
        <Icon style={svgStyle} />
      </div>
      <div className={styles.rowContent}>
        <Heading
          appearance={{ size: 'small', width: 'bold', margin: 'small' }}
          text={title}
        />
        <Heading
          appearance={{ size: 'tiny', width: 'veryThin', margin: 'small' }}
          text={subTitle}
        />
      </div>
      <ArrowRight className={styles.rowArrow} />
    </div>
  );
};

const allTheRows = Object.keys(rowTitles).map((key, i) => {
  const keys = Object.keys(rowSubTitles);
  const title = rowTitles[key];
  const subTitle = rowSubTitles[keys[i]];

  return (
    <NavLink key={`Link${title.id}`} exact to="/">
      <DetailRow
        title={title}
        subTitle={subTitle}
        key={`row${title.id}`}
        rowIndex={i}
      />
    </NavLink>
  );
});

const WalletDetails = () => (
  <WizardTemplate>
    <section className={styles.content}>
      <div className={styles.title}>
        <Heading
          appearance={{ size: 'medium', weight: 'thin' }}
          text={MSG.heading}
        />
      </div>
      <div className={styles.subtitle}>
        <Heading
          appearance={{ size: 'normal', weight: 'thin' }}
          text={MSG.subTitle}
        />
      </div>
      {allTheRows}
      <Button className={styles.callToAction} type="submit">
        <div className={styles.actionImage}>
          <img src={jazz} alt="" width="22" height="22" />
        </div>
        <div className={styles.actionText}>
          <Heading
            appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
            text={MSG.callToAction}
          />
          <Heading
            appearance={{ size: 'tiny', weight: 'thin', margin: 'small' }}
            text={MSG.callToActionSub}
          />
        </div>
        <ArrowRight className={styles.rowArrow} />
      </Button>
    </section>
  </WizardTemplate>
);

export default WalletDetails;
