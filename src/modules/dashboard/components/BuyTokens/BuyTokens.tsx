import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import BreadCrumb from '~core/BreadCrumb';
import { AnyToken } from '~data/index';
import { Address } from '~types/index';

const MSG = defineMessages({
  title: {
    id: 'dashboard.BuyTokens.title',
    defaultMessage: 'Tokens',
  },
  buyTokens: {
    id: 'dashboard.BuyTokens.buyTokens',
    defaultMessage: 'Buy {symbol}',
  },
});

interface Props {
  colonyAddress: Address;
  colonyName: string;
  nativeToken: AnyToken;
}

const displayName = 'dashboard.BuyTokens';

const BuyTokens = ({
  // @todo remove this `disable` once `colonyAddress` is used for check
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  colonyAddress,
  colonyName,
  nativeToken: { symbol },
}: Props) => {
  // @todo use a real check here
  const canColonySellTokens = true;

  const { formatMessage } = useIntl();

  if (!canColonySellTokens) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  const breadCrumbs = [MSG.title, formatMessage(MSG.buyTokens, { symbol })];

  return (
    <>
      <BreadCrumb elements={breadCrumbs} />
    </>
  );
};

BuyTokens.displayName = displayName;

export default BuyTokens;
