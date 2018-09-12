/* @flow */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WizardTemplate from '../../../pages/WizardTemplate';

import styles from './AccessToken.css';

import UseTokenWizard from '../UseTokenWizard';
import CreateTokenWizard from '../CreateTokenWizard';

import { CREATECOLONY_SLUG_CREATE, CREATECOLONY_SLUG_ACCESS } from './routes';

const AccessToken = () => (
  <WizardTemplate>
    <div className={styles.mainContent}>
      <Switch>
        <Route path={CREATECOLONY_SLUG_CREATE} component={CreateTokenWizard} />
        <Route path={CREATECOLONY_SLUG_ACCESS} component={UseTokenWizard} />
        <Redirect to="/start" />
      </Switch>
    </div>
  </WizardTemplate>
);

export default AccessToken;
