/* eslint-disable max-len */

import { ColonyActions } from '~types/index';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActions.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyActions.MintTokens} {Mint {amount} {tokenSymbol}}
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${ColonyActions.Payment} {Payment}
      ${ColonyActions.MoveFunds} {Move Funds}
      ${ColonyActions.MintTokens} {Mint Tokens}
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
