import { createIntl } from 'react-intl';
import { isHexString } from 'ethers/utils';
import { hexSequenceNormalizer } from '@purser/core';

import { TRANSACTION_METHODS } from '~immutable/index';
import { ContractRevertErrors } from '~types/index';

const intl = createIntl({
  locale: 'en',
  messages: {
    'error.unknown': 'Unknown broadcaster error',
    'error.tokenLocked': 'Colony Token locked and cannot be activated',
    'error.invalidSignature': `Invalid Metatransaction signature sent to the broadcaster`,
  },
});

export const generateBroadcasterHumanReadableError = (
  methodName?: string,
  error?: { reason?: string },
  response?: {
    payload?: string;
    reason?: string;
  },
): string => {
  let errorMessage =
    error?.reason ||
    response?.reason ||
    response?.payload ||
    intl.formatMessage({ id: 'error.unknown' });

  /*
   * @NOTE Account for error reasons encoded as hex strings
   * From RPC endpoints like Nethermind
   */
  const [, foundHexString] = response?.reason?.match(/(0x.*)/) || [];
  const isHexReason = foundHexString && isHexString(foundHexString);
  const hexReasonValue = isHexReason
    ? Buffer.from(
        hexSequenceNormalizer(foundHexString, false),
        'hex',
      ).toString()
    : '';

  if (
    (methodName === TRANSACTION_METHODS.Approve &&
      response?.reason?.includes(ContractRevertErrors.TokenUnauthorized)) ||
    hexReasonValue.includes(ContractRevertErrors.TokenUnauthorized)
  ) {
    errorMessage = intl.formatMessage({ id: 'error.tokenLocked' });
    return errorMessage;
  }

  if (
    response?.reason?.includes(ContractRevertErrors.MetaTxInvalidSignature) ||
    hexReasonValue.includes(ContractRevertErrors.MetaTxInvalidSignature) ||
    response?.reason?.includes(ContractRevertErrors.TokenInvalidSignature) ||
    hexReasonValue.includes(ContractRevertErrors.TokenInvalidSignature)
  ) {
    errorMessage = intl.formatMessage({ id: 'error.invalidSignature' });
    return errorMessage;
  }

  return errorMessage;
};
