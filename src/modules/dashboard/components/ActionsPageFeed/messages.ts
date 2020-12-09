/* eslint-disable max-len */

import { defineMessages } from 'react-intl';

import { ColonyAndExtensionsEvents } from '~types/index';

const MSG = defineMessages({
  eventTitle: {
    id: 'dashboard.ActionsPage.eventTitle',
    defaultMessage: `{eventName, select,
      ${ColonyAndExtensionsEvents.PaymentAdded} {{initiator} created {payment} to pay {amount} {tokenSymbol} to {recipient}}
      other {{eventNameDecorated} emmited by {clientOrExtensionType}}
    }`,
  },
});

export default MSG;
