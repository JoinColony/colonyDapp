import { ColonyTokenReferenceType, TokenType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataFetcher, useSelector, useTransformer } from '~utils/hooks';
import { colonyFetcher } from '../fetchers';
import { allTokensSelector, colonyTokensSelector } from '../selectors';
import { getTokensFromColony } from '../transformers';

export const useColonyTokens = (
  colonyAddress: Address | null,
): [ColonyTokenReferenceType[] | null, TokenType[] | null] => {
  const { data: fetchedColony } = useDataFetcher(
    colonyFetcher,
    [colonyAddress as string],
    [colonyAddress],
  );
  const { colonyAddress: fetchedColonyAddress = undefined } =
    fetchedColony || {};

  const colonyTokenReferences = useSelector(colonyTokensSelector, [
    fetchedColonyAddress,
  ]);

  const allTokens = useSelector(allTokensSelector);

  const availableTokens = useTransformer(getTokensFromColony, [
    allTokens,
    colonyTokenReferences,
  ]);

  return [colonyTokenReferences, availableTokens];
};
