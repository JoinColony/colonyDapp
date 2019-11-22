import { ColonyTokenReferenceType, TokenType } from '~immutable/index';

import { AllTokensMapType } from './state';

export const getTokensFromColony = (
  allTokens: AllTokensMapType,
  colonyTokens: ColonyTokenReferenceType[],
): TokenType[] => {
  const tokenAddresses = colonyTokens.map(({ address }) => address);
  return Object.entries(allTokens)
    .filter(([address]) => tokenAddresses.includes(address))
    .map(([, { record: token }]) => token)
    .filter(Boolean);
};
