import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import BreadCrumb from '~core/BreadCrumb';
import { AnyToken } from '~data/index';
import { Address } from '~types/index';

import styles from './CoinMachine.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CoinMachine.title',
    defaultMessage: 'Tokens',
  },
  buyTokens: {
    id: 'dashboard.CoinMachine.buyTokens',
    defaultMessage: 'Buy {symbol}',
  },
});

interface Props {
  colonyAddress: Address;
  colonyName: string;
  nativeToken: AnyToken;
}

const displayName = 'dashboard.CoinMachine';

const CoinMachine = ({
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
    <div className={styles.main}>
      <BreadCrumb elements={breadCrumbs} />
      <div className={styles.grid}>
        <div className={styles.purchase}>
          {/* Purchase info / post-purchase in #2207 */}
        </div>
        <div className={styles.previousSales}>
          {/* Previous sales in #2210 */}
        </div>
        <div className={styles.chat}>{/* Chat in #2211 */}</div>
      </div>
    </div>
  );
};

CoinMachine.displayName = displayName;

export default CoinMachine;
