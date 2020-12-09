/* eslint-disable max-len */

import { ColonyActions } from '~types/index';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      other {Some other title}
    }`,
};

export default actionsMessageDescriptors;
