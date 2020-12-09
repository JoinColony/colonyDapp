/* eslint-disable max-len */

import { defineMessages } from 'react-intl';

import { ColonyActions } from '~types/index';

const MSG = defineMessages({
  actionTitle: {
    id: 'dashboard.ActionsPage.actionTitle',
    defaultMessage: `{actionType, select,
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      other {Some other title}
    }`,
  },
});

export default MSG;
