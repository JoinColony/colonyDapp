import { ColonyType, TokenReferenceType, TokenType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataSubscriber, useSelector } from '~utils/hooks';
import { colonySubscriber } from '../subscribers';
import {
  allFromColonyTokensSelector,
  colonyTokensSelector,
} from '../selectors';

export const useColonyTokens = (
  colonyAddress: Address | null,
): [TokenReferenceType[] | null, TokenType[] | null] => {
  const { data: fetchedColony } = useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
  );
  const { colonyAddress: fetchedColonyAddress = undefined } =
    fetchedColony || {};

  const colonyTokenReferences: TokenReferenceType[] = useSelector(
    colonyTokensSelector,
    [fetchedColonyAddress],
  );

  const availableTokens: TokenType[] = useSelector(
    allFromColonyTokensSelector,
    [colonyTokenReferences],
  );

  return [colonyTokenReferences, availableTokens];
};
