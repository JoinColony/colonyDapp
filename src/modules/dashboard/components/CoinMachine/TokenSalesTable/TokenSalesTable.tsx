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

import TokenPriceStatusIcon, {
  TokenPriceStatuses,
} from '../TokenPriceStatusIcon';

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
  // @TODO: Add correct type for table data
  tableData: any[];
}

const displayName = 'dashboard.CoinMachine.TokenSalesTable';

const TABLE_HEADERS = [
  {
    text: MSG.saleColumnTitle,
  },
  {
    text: MSG.amountColumnTitle,
    textValues: {
      // @TODO: Plug in dynamic native token symbol
      nativeTokenSymbol: 'CLNY',
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

const TokenSalesTable = ({ tableData = [] }: Props) => {
  const formattedData = useMemo(() => {
    return tableData.map((data) => {
      return {
        saleEndedAt: new Date(data.saleEndedAt),
        tokensRemaining: `${getFormattedTokenValue(data.tokensBought, 18)}/100`,
        price: getFormattedTokenValue(data.totalPrice, 18),
        priceStatus: TokenPriceStatuses.PRICE_UP,
      };
    });
  }, [tableData]);
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
              ({ saleEndedAt, tokensRemaining, price, priceStatus }) => (
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
                      // @TODO: Add proper logic to determine when to use the danger color
                      [styles.cellDataDanger]: tokensRemaining === 'SOLD OUT',
                    })}
                  >
                    {tokensRemaining}
                  </TableCell>
                  <TableCell className={styles.cellData}>
                    {price}
                    <TokenPriceStatusIcon status={priceStatus} />
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
