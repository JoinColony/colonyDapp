/* eslint-disable max-len */

import { ColonyActions } from '~types/index';

const actionsMessageDescriptors = {
  'action.title': `{actionType, select,
      ${ColonyActions.WrongColony} {Unknown Action}
      ${ColonyActions.Payment} {Pay {recipient} {amount} {tokenSymbol}}
      ${ColonyActions.MoveFunds} {Move {amount} {tokenSymbol} from {fromDomain} to {toDomain}}
      ${ColonyActions.MintTokens} {Mint {amount} {tokenSymbol}}
      ${ColonyActions.CreateDomain} {New team: {fromDomain}}
      ${ColonyActions.VersionUpgrade} {Upgrade Colony!}
      other {Generic action we don't have information about}
    }`,
  'action.type': `{actionType, select,
      ${ColonyActions.WrongColony} {Not part of the Colony}
      ${ColonyActions.Payment} {Payment}
      ${ColonyActions.MoveFunds} {Move Funds}
      ${ColonyActions.MintTokens} {Mint Tokens}
      ${ColonyActions.CreateDomain} {Create Team}
      ${ColonyActions.VersionUpgrade} {Version Upgrade}
      other {Generic}
    }`,
};

export default actionsMessageDescriptors;
