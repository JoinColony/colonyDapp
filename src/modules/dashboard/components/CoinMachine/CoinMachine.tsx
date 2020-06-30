import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import BreadCrumb from '~core/BreadCrumb';
import Button from '~core/Button';
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
  learnMoreLinkText: {
    id: 'dashboard.CoinMachine.learnMoreLinkText',
    defaultMessage: 'Learn More',
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

  const handleLearnMoreClick = () => {
    // @todo open welcome modal via #2205
    // eslint-disable-next-line no-console
    console.log('Learn more clicked');
  };

  if (!canColonySellTokens) {
    return <Redirect to={`/colony/${colonyName}`} />;
  }

  const breadCrumbs = [MSG.title, formatMessage(MSG.buyTokens, { symbol })];

  return (
    <div className={styles.main}>
      <div className={styles.breadcrumbsContainer}>
        <div>
          <BreadCrumb elements={breadCrumbs} />
        </div>
        <div>
          <Button
            appearance={{ theme: 'blue' }}
            onClick={handleLearnMoreClick}
            text={MSG.learnMoreLinkText}
            type="button"
          />
        </div>
      </div>
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
