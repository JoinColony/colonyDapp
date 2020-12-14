/* eslint-disable max-len */

import { ColonyActions } from '~types/index';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      other {Generic action we don't have information about}
    }`,
};

export default actionsMessageDescriptors;
