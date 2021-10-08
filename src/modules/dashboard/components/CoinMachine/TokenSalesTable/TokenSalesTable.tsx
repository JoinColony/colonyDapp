import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import Heading from '~core/Heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '~core/Table';
import ExternalLink from '~core/ExternalLink';

import { getFormattedTokenValue } from '~utils/tokens';
import {
  TokenInfoQuery,
  useCoinMachineSalePeriodsQuery,
  SalePeriod,
} from '~data/index';
import { Address } from '~types/index';
import { getPriceStatus } from '~utils/colonyCoinMachine';
import { getBlockExplorerLink } from '~utils/external';
import { DEFAULT_NETWORK_INFO } from '~constants';

import TokenPriceStatusIcon from '../TokenPriceStatusIcon';
import { PeriodTokensType } from '../RemainingDisplayWidgets';
import SoldTokensWidget from './SoldTokensWidget';

import styles from './TokenSalesTable.css';

const MSG = defineMessages({
  tableTitle: {
    id: 'dashboard.CoinMachine.TokenSalesTable.tableTitle',
    defaultMessage: `Previous Sales`,
  },
  saleColumnTitle: {
    id: `dashboard.CoinMachine.TokenSalesTable.saleColumnTitle`,
    defaultMessage: 'Sale End',
  },
  amountColumnTitle: {
    id: `dashboard.CoinMachine.TokenSalesTable.amountColumnTitle`,
    defaultMessage: 'Amount {nativeTokenSymbol}',
  },
  priceColumnTitle: {
    id: `dashboard.CoinMachine.TokenSalesTable.priceColumnTitle`,
    defaultMessage: 'Price ETH',
  },
  noTableData: {
    id: 'dashboard.CoinMachine.TokenSalesTable.noTableData',
    defaultMessage: 'No sales have completed yet.',
  },
  olderPeriodsHidden: {
    id: 'dashboard.CoinMachine.TokenSalesTable.olderPeriodsHidden',
    defaultMessage: `
      The previous sales table has been truncated due to performance reasons.
      You can view older entries manually using {blockExplorerLink}`,
  },
});

interface Props {
  periodTokens?: PeriodTokensType;
  sellableToken?: TokenInfoQuery['tokenInfo'];
  colonyAddress: Address;
  periodLength: number;
  periodRemainingTime: number;
  extensionAddress?: Address;
}

const displayName = 'dashboard.CoinMachine.TokenSalesTable';

const TokenSalesTable = ({
  periodTokens,
  sellableToken,
  colonyAddress,
  periodLength,
  periodRemainingTime,
  extensionAddress,
}: Props) => {
  const PREV_PERIODS_LIMIT = 100;
  const salePeriodQueryVariables = { colonyAddress, limit: PREV_PERIODS_LIMIT };

  const {
    data: salePeriodsData,
    loading: salePeriodsLoading,
    refetch: refetchSalePeriodsData,
    startPolling: startPollingSalePeriodsData,
    stopPolling: stopPollingSalePeriodsData,
  } = useCoinMachineSalePeriodsQuery({
    variables: salePeriodQueryVariables,
  });

  const TABLE_HEADERS = [
    {
      text: MSG.saleColumnTitle,
    },
    {
      text: MSG.amountColumnTitle,
      textValues: {
        nativeTokenSymbol: sellableToken?.symbol,
        span: (chunks) => <span className={styles.tokenSymbol}>{chunks}</span>,
      },
    },
    {
      text: MSG.priceColumnTitle,
      textValues: {
        span: (chunks) => <span className={styles.tokenSymbol}>{chunks}</span>,
      },
    },
  ];

  const tableData =
    ((salePeriodsData?.coinMachineSalePeriods as unknown) as SalePeriod[]) ||
    [];

  const formattedData = useMemo(() => {
    return tableData.map(
      ({ saleEndedAt, tokensAvailable, tokensBought, price }) => {
        return {
          saleEndedAt: new Date(parseInt(saleEndedAt, 10)),
          tokensRemaining: periodTokens ? (
            <SoldTokensWidget
              periodTokens={periodTokens}
              tokensBought={tokensBought}
              tokensAvailable={tokensAvailable}
            />
          ) : (
            '0/0'
          ),
          hasSoldOut: periodTokens?.maxPeriodTokens.lte(tokensBought),
          price: getFormattedTokenValue(price, 18),
          priceStatus:
            periodTokens && getPriceStatus(periodTokens, tokensBought),
        };
      },
    );
  }, [periodTokens, tableData]);

  /*
   * Manually update the sale table the first time around, if the remaining
   * time in the period is less than the period leght
   *
   * This is for cases where you load the page in the middle of period
   *
   * @TODO List
   * - Add message if number of sale periods exceeds <limit>
   */
  useEffect(() => {
    if (
      periodRemainingTime > 1000 &&
      periodRemainingTime < periodLength * 1000
    ) {
      setTimeout(() => {
        refetchSalePeriodsData(salePeriodQueryVariables);
        startPollingSalePeriodsData(periodLength * 1000);
      }, periodRemainingTime);
    } else {
      startPollingSalePeriodsData(periodLength * 1000);
    }
    return () => stopPollingSalePeriodsData();
  }, [
    periodLength,
    periodRemainingTime,
    refetchSalePeriodsData,
    salePeriodQueryVariables,
    startPollingSalePeriodsData,
    stopPollingSalePeriodsData,
  ]);

  /*
   * @TODO Add proper loading component
   */
  if (salePeriodsLoading) {
    return <span>Loading</span>;
  }

  return (
    <div className={styles.container}>
      <Heading
        text={MSG.tableTitle}
        appearance={{
          size: 'small',
          theme: 'dark',
        }}
      />
      <div className={styles.tableContainer}>
        <Table className={styles.table} appearance={{ separators: 'none' }}>
          <TableHeader className={styles.tableHeader}>
            <TableRow>
              {TABLE_HEADERS.map((header) => (
                <TableHeaderCell
                  key={header.text.id}
                  className={styles.tableHeaderCell}
                >
                  <FormattedMessage
                    {...header.text}
                    values={header.textValues}
                  />
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedData.map(
              ({
                saleEndedAt,
                tokensRemaining,
                hasSoldOut,
                price,
                priceStatus,
              }) => (
                <TableRow
                  className={styles.tableRow}
                  key={saleEndedAt.getTime()}
                >
                  <TableCell className={styles.cellData}>
                    <FormattedDate
                      value={saleEndedAt}
                      month="2-digit"
                      day="2-digit"
                      hour12={false}
                      hour="2-digit"
                      minute="2-digit"
                    />
                  </TableCell>
                  <TableCell
                    className={classnames(styles.cellData, {
                      [styles.cellDataDanger]: hasSoldOut,
                    })}
                  >
                    {tokensRemaining}
                  </TableCell>
                  <TableCell className={styles.cellData}>
                    {price}
                    {priceStatus && (
                      <TokenPriceStatusIcon status={priceStatus} />
                    )}
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
        {isEmpty(tableData) && (
          <p className={styles.noDataMessage}>
            <FormattedMessage {...MSG.noTableData} />
          </p>
        )}
        {formattedData.length >= PREV_PERIODS_LIMIT && (
          <p className={styles.hiddenDataMessage}>
            <FormattedMessage
              {...MSG.olderPeriodsHidden}
              values={{
                blockExplorerLink: (
                  <ExternalLink
                    href={getBlockExplorerLink({
                      addressOrHash: extensionAddress || '0x',
                    })}
                    text={DEFAULT_NETWORK_INFO.blockExplorerName}
                  />
                ),
              }}
            />
          </p>
        )}
      </div>
    </div>
  );
};

TokenSalesTable.displayName = displayName;

export default TokenSalesTable;
