/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch, NavLink } from 'react-router-dom';

import layout from '~styles/layout.css';

import messages from './i18n/en.json';

import { Provider as ContextProvider } from './createReactContext';

import CreateColonyWizard from '~dashboard/CreateColonyWizard';
import Dashboard from '~dashboard/Dashboard';

import UserProfile from '~users/UserProfile';
import UserProfileEdit from '~users/UserProfileEdit';

import ConnectWallet from '~wallet/ConnectWallet';
import WalletStart from '~wallet/WalletStart';
import ProfileCreate from '~wallet/ProfileCreate';
import CreateWalletWizard from '~wallet/CreateWalletWizard';

import DialogProvider from '~core/Dialog/DialogProvider.jsx';
import ActivityBarExample from '~core/ActivityBar/ActivityBarExample.jsx';

addLocaleData(en);

const dialogComponents = {
  // Hint: Once we have the gas station we just have to add it here
  ActivityBarExample,
};

const Home = () => (
  <ul>
    <li>
      <NavLink style={{ color: 'blue' }} to="/createcolony">
        Create Colony Wizard
      </NavLink>
    </li>
    <li>
      <NavLink style={{ color: 'blue' }} to="/dashboard">
        Dashboard
      </NavLink>
    </li>
    <li>
      <NavLink style={{ color: 'blue' }} to="/start">
        Start
      </NavLink>
    </li>
    <li>
      <NavLink style={{ color: 'blue' }} to="/profile">
        User Profile
      </NavLink>
    </li>
  </ul>
);

type Props = {
  store: Object,
  context: Object,
  history: History,
};

export default function App({ store, context, history }: Props) {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={messages}>
      <ContextProvider value={context}>
        <Provider store={store}>
          <DialogProvider dialogComponents={dialogComponents}>
            <ConnectedRouter history={history}>
              <div className={layout.stretch}>
                <Route exact path="/" component={Home} />
                <Route path="/createcolony" component={CreateColonyWizard} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/start" component={WalletStart} />
                <Route path="/createwallet" component={CreateWalletWizard} />
                <Route
                  path="/connectwallet/:provider"
                  component={ConnectWallet}
                />
                <Route path="/profile" component={UserProfile} />
                {/* eslint-disable-next-line */}
                {/* TODO: to the router person: please find a way to have this be /profile/edit */}
                <Route path="/profileedit" component={UserProfileEdit} />
                <Route path="/createprofile" component={ProfileCreate} />
              </div>
            </ConnectedRouter>
          </DialogProvider>
        </Provider>
      </ContextProvider>
    </IntlProvider>
  );
}
