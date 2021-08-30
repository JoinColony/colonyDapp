import React, { useMemo } from 'react';
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
import { getFormattedTokenValue } from '~utils/tokens';
import {
  SubgraphCoinMachinePeriodsQuery,
  TokenInfoQuery,
} from '~data/generated';
import { getPriceStatus } from '~utils/colonyCoinMachine';
import { RemainingTokensValue } from '~utils/components';

import TokenPriceStatusIcon from '../TokenPriceStatusIcon';
import { PeriodTokensType } from '../RemainingDisplayWidget';

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
    defaultMessage: 'Amount <span>{nativeTokenSymbol}</span>',
  },
  priceColumnTitle: {
    id: `dashboard.CoinMachine.TokenSalesTable.priceColumnTitle`,
    defaultMessage: 'Price <span>ETH</span>',
  },
  noTableData: {
    id: 'dashboard.CoinMachine.TokenSalesTable.noTableData',
    defaultMessage: 'No sales have completed yet.',
  },
});

interface Props {
  tableData?: SubgraphCoinMachinePeriodsQuery['coinMachinePeriods'];
  periodTokens?: PeriodTokensType;
  sellableToken?: TokenInfoQuery['tokenInfo'];
}

const displayName = 'dashboard.CoinMachine.TokenSalesTable';

const TokenSalesTable = ({
  tableData = [],
  periodTokens,
  sellableToken,
}: Props) => {
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

  const formattedData = useMemo(() => {
    return tableData.map((data) => {
      return {
        saleEndedAt: new Date(parseInt(data.saleEndedAt, 10)),
        tokensRemaining: periodTokens ? (
          <RemainingTokensValue
            periodTokens={periodTokens}
            tokensBought={data.tokensBought}
          />
        ) : (
          '???'
        ),
        hasSoldOut: periodTokens?.maxPeriodTokens.eq(data.tokensBought),
        price: getFormattedTokenValue(data.price, 18),
        priceStatus:
          periodTokens && getPriceStatus(periodTokens, data.tokensBought),
      };
    });
  }, [tableData, periodTokens]);
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
      </div>
    </div>
  );
};

TokenSalesTable.displayName = displayName;

export default TokenSalesTable;
