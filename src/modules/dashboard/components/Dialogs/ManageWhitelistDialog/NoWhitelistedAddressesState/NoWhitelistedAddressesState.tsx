import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import styles from './NoWhitelistedAddressesState.css';

const MSG = defineMessages({
  title: {
    id: `dashboard.ManageWhitelistDialog.NoWhitelistedAddressesState.title`,
    defaultMessage: 'The address book is empty.',
  },
  desc: {
    id: `dashboard.ManageWhitelistDialog.NoWhitelistedAddressesState.desc`,
    defaultMessage: `Click tab "Add address" to add the first one`,
  },
});

const displayName =
  'dashboard.ManageWhitelistDialog.NoWhitelistedAddressesState';

const NoWhitelistedAddressesState = () => {
  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </div>
      <div className={styles.desc}>
        <FormattedMessage {...MSG.desc} />
      </div>
    </div>
  );
};

NoWhitelistedAddressesState.displayName = displayName;

export default NoWhitelistedAddressesState;
