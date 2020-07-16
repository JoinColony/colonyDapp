import React, { useCallback, useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

import BreadCrumb from '~core/BreadCrumb';
import Button from '~core/Button';
import { AnyToken } from '~data/index';
import { Address } from '~types/index';
import { useDialog } from '~core/Dialog';

import CoinMachineWelcomeDialog from './CoinMachineWelcomeDialog';
import TimeRemainingCard from './TimeRemainingCard';
import TokensRemainingCard from './TokensRemainingCard';
import CoinMachineChat from './CoinMachineChat';

import styles from './CoinMachine.css';

const LOCALSTORAGE_KEY = 'colony-coinmachine-welcome';

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
  colonyDisplayName: string;
  nativeToken: AnyToken;
}

const displayName = 'dashboard.CoinMachine';

const CoinMachine = ({
  // @todo remove this `disable` once `colonyAddress` is used for check
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  colonyAddress,
  colonyName,
  colonyDisplayName,
  nativeToken: { symbol },
}: Props) => {
  // @todo use a real check here
  const canColonySellTokens = true;

  // @todo get this somehow
  const timeRemaining = 10 * 60 * 1000;
  const totalSaleTime = 100 * 60 * 1000;
  const tokensRemaining = 100;
  const totalSupply = 300;
  const tokenTarget = 150;

  const { formatMessage } = useIntl();
  const openDialog = useDialog(CoinMachineWelcomeDialog);
  const handleOpenDialog = useCallback(
    () =>
      openDialog({
        colonyDisplayName,
        tokenSymbol: symbol,
      }),
    [colonyDisplayName, openDialog, symbol],
  );

  useEffect(() => {
    if (!localStorage.getItem(LOCALSTORAGE_KEY)) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(true));
      handleOpenDialog();
    }
  }, [handleOpenDialog]);

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
            onClick={handleOpenDialog}
            text={{ id: 'text.learnMore' }}
            type="button"
          />
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.purchase}>
          <div className={styles.buyCLNY} />
          <div className={styles.timeRemaining}>
            <TimeRemainingCard
              msRemaining={timeRemaining}
              totalTime={totalSaleTime}
            />
          </div>
          <div className={styles.tokensRemaining}>
            <TokensRemainingCard
              target={tokenTarget}
              tokensRemaining={tokensRemaining}
              totalSupply={totalSupply}
            />
          </div>
        </div>
        <div className={styles.previousSales}>
          {/* Previous sales in #2210 */}
        </div>
        <div className={styles.chat}>
          <CoinMachineChat />
        </div>
      </div>
    </div>
  );
};

CoinMachine.displayName = displayName;

export default CoinMachine;
