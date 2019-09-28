import { ColonyTokenReferenceType, TokenType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataSubscriber, useSelector } from '~utils/hooks';
import { colonySubscriber } from '../subscribers';
import {
  allFromColonyTokensSelector,
  colonyTokensSelector,
} from '../selectors';

export const useColonyTokens = (
  colonyAddress: Address | null,
): [ColonyTokenReferenceType[] | null, TokenType[] | null] => {
  const { data: fetchedColony } = useDataSubscriber(
    colonySubscriber,
    [colonyAddress as string],
    [colonyAddress],
  );
  const { colonyAddress: fetchedColonyAddress = undefined } =
    fetchedColony || {};

  const colonyTokenReferences = useSelector(colonyTokensSelector, [
    fetchedColonyAddress,
  ]);

  const availableTokens = useSelector(allFromColonyTokensSelector, [
    colonyTokenReferences,
  ]);

  return [colonyTokenReferences, availableTokens];
};
