/* @flow */

import type { ColonyType, TokenReferenceType, TokenType } from '~immutable';
import type { Address } from '~types';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { colonyFetcher } from '../fetchers';
import {
  allFromColonyTokensSelector,
  colonyTokensSelector,
} from '../selectors';

// eslint-disable-next-line import/prefer-default-export
export const useColonyTokens = (
  colonyAddress: ?Address,
): [?(TokenReferenceType[]), ?(TokenType[])] => {
  // Need to fetch the colony, to ensure all tokens are loaded as well
  const { data: fetchedColony } = useDataFetcher<ColonyType>(
    colonyFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const { colonyAddress: fetchedColonyAddress } = fetchedColony || {};

  const colonyTokenReferences: Array<TokenReferenceType> = useSelector(
    colonyTokensSelector,
    [fetchedColonyAddress],
  );

  const availableTokens: Array<TokenType> = useSelector(
    allFromColonyTokensSelector,
    [colonyTokenReferences],
  );

  return [colonyTokenReferences, availableTokens];
};
