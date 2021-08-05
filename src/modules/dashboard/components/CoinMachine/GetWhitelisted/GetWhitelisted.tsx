import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Button from '~core/Button';
import { Address } from '~types/index';

import {
  useWhitelistPolicyQuery,
  UserWhitelistStatus
} from '~data/index';

const MSG = defineMessages({
  getWhitelisted: {
    id: 'dashbord.CoinMachine.BuyWidget.getWhitelisted',
    defaultMessage: 'Get whitelisted',
  },
});

type Props = {
  disabled: boolean;
  colonyAddress: Address;
  userStatus: UserWhitelistStatus;
};

const displayName = 'dashboard.CoinMachine.GetWhitelisted';

const GetWhitelisted = ({ disabled, colonyAddress, userStatus }: Props) => {

  const {
    data: whitelistPolicyData,
  } = useWhitelistPolicyQuery({
    variables: { colonyAddress },
  });

  return (
    <Button
      text={MSG.getWhitelisted}
      appearance={{ theme: 'primary', size: 'large' }}
      disabled={disabled}
    />
  );
};

GetWhitelisted.displayName = displayName;

export default GetWhitelisted;
