/* eslint-disable max-len */

import { ColonyActions } from '~types/index';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActions.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${ColonyActions.Payment} {Payment}
      ${ColonyActions.MoveFunds} {Move Funds}
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
