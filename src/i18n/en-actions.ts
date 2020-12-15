/* eslint-disable max-len */

import camelcase from 'camelcase';

import { ColonyActions } from '~types/index';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${camelcase(
        ColonyActions.Payment,
      )} {Pay {recipient} {amount} {tokenSymbol}}
      ${camelcase(
        ColonyActions.MoveFunds,
      )} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${camelcase(ColonyActions.Payment)} {Payment}
      ${camelcase(ColonyActions.MoveFunds)} {Move Funds}
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
