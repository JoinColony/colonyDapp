/* eslint-disable max-len */

import { ColonyAndExtensionsEvents } from '~types/index';

const eventsMessageDescriptors = {
  'event.title': `{eventName, select,
      ${ColonyAndExtensionsEvents.PaymentAdded} {{initiator} paid {amount} {tokenSymbol} from {paymentId} to {recipient}}
      other {{eventNameDecorated} emmited by {clientOrExtensionType}}
    }`,
};

export default eventsMessageDescriptors;
