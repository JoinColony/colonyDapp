/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
//import PropTypes from 'prop-types';

import styles from './CreateWallet.css';
// import Button from '../../../core/components/Button';
import Heading from '../../../core/components/Heading';
import Icon from '../../../core/components/Icon';

const DetailRow = () => (
  <div className={`${styles.row}`}>
    <Icon name="metamask" size="medium" />
  </div>
);

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

// Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.
const WalletDetails = () => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'medium' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'normal' }} text={MSG.subtitle} />
    </div>
    <DetailRow />
    <DetailRow />
    <DetailRow />
    <DetailRow />
    <div className={`${styles.callToAction}`}>
      <FormattedMessage {...MSG.callToAction} />
    </div>
  </section>
);

export default WalletDetails;
