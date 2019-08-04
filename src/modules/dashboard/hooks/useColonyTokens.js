/* @flow */

import type { ColonyType, TokenReferenceType, TokenType } from '~immutable';
import type { Address } from '~types';

import { useDataSubscriber, useSelector } from '~utils/hooks';

import { colonySubscriber } from '../subscribers';
import {
  allFromColonyTokensSelector,
  colonyTokensSelector,
} from '../selectors';

// eslint-disable-next-line import/prefer-default-export
export const useColonyTokens = (
  colonyAddress: ?Address,
): [?(TokenReferenceType[]), ?(TokenType[])] => {
  const { data: fetchedColony } = useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
    { alwaysSubscribe: false },
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
