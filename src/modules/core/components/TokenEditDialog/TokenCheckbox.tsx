import React from 'react';
import { defineMessages } from 'react-intl';

import {
  ColonyTokenReferenceType,
  UserTokenReferenceType,
} from '~immutable/index';

import { useDataFetcher } from '~utils/hooks';
import { Checkbox } from '~core/Fields';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { tokenIsETH } from '../../checks';
import { tokenFetcher } from '../../../dashboard/fetchers';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  unknownToken: {
    id: 'core.TokenEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

const TokenCheckbox = ({
  token: { address },
  token: tokenReference,
}: {
  token: ColonyTokenReferenceType | UserTokenReferenceType;
}) => {
  const { data: token } = useDataFetcher(tokenFetcher, [address], [address]);
  return token ? (
    <Checkbox
      className={styles.tokenChoice}
      value={address}
      name="tokens"
      disabled={
        ('isNative' in tokenReference && !!tokenReference.isNative) ||
        tokenIsETH(token)
      }
    >
      <TokenIcon token={tokenReference} name={token.name} />
      <span className={styles.tokenChoiceSymbol}>
        <Heading
          text={token.symbol || token.name || MSG.unknownToken}
          appearance={{ size: 'small', margin: 'none' }}
        />
        {(!!token.symbol && token.name) || address}
      </span>
    </Checkbox>
  ) : (
    <SpinnerLoader />
  );
};

TokenCheckbox.displayName = 'core.TokenEditDialog.TokenCheckbox';

export default TokenCheckbox;
