/* @flow */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WizardTemplate from '../../../pages/WizardTemplate';

import styles from './ConnectWallet.css';

import Hardware from './Hardware';
import JSONUpload from './JSONUpload';
import MetaMask from './MetaMask';
import Mnemonic from './Mnemonic';

import {
  CONNECT_WALLET_SLUG_HARDWARE,
  CONNECT_WALLET_SLUG_JSON,
  CONNECT_WALLET_SLUG_METAMASK,
  CONNECT_WALLET_SLUG_MNEMONIC,
} from './routes';

const ConnectWallet = () => (
  <WizardTemplate>
    <div className={styles.mainContent}>
      <Switch>
        <Route path={CONNECT_WALLET_SLUG_HARDWARE} component={Hardware} />
        <Route path={CONNECT_WALLET_SLUG_JSON} component={JSONUpload} />
        <Route path={CONNECT_WALLET_SLUG_METAMASK} component={MetaMask} />
        <Route path={CONNECT_WALLET_SLUG_MNEMONIC} component={Mnemonic} />
        <Redirect to="/start" />
      </Switch>
    </div>
  </WizardTemplate>
);

export default ConnectWallet;
