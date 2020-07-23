import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedDate,
  FormattedNumber,
  FormattedMessage,
  FormattedTime,
  MessageDescriptor,
} from 'react-intl';
import { useMeasure } from 'react-use';
import BN from 'bn.js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Card from '~core/Card';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '~core/Table';

import styles from './PreviousSales.css';

const MSG = defineMessages({
  decrease: {
    id: 'dashboard.CoinMachine.PreviousSales.decrease',
    defaultMessage: 'Price decreased from previous sale',
  },
  increase: {
    id: 'dashboard.CoinMachine.PreviousSales.increase',
    defaultMessage: 'Price increased from previous sale',
  },
  numberSold: {
    id: 'dashboard.CoinMachine.PreviousSales.numberSold',
    defaultMessage: '{tokensSold}/{tokensForSale}',
  },
  push: {
    id: 'dashboard.CoinMachine.PreviousSales.push',
    defaultMessage: 'Price unchanged from previous sale',
  },
  soldOut: {
    id: 'dashboard.CoinMachine.PreviousSales.soldOut',
    defaultMessage: 'SOLD OUT',
  },
  tableHeaderEnd: {
    id: 'dashboard.CoinMachine.PreviousSales.tableHeaderEnd',
    defaultMessage: 'Sale End',
  },
  tableHeaderAmount: {
    id: 'dashboard.CoinMachine.PreviousSales.tableHeaderAmount',
    defaultMessage: 'Amount {symbol}',
  },
  tableHeaderPrice: {
    id: 'dashboard.CoinMachine.PreviousSales.tableHeaderPrice',
    defaultMessage: 'Price {symbol}',
  },
  title: {
    id: 'dashboard.CoinMachine.PreviousSales.title',
    defaultMessage: 'Previous Sales',
  },
});

enum SaleStatus {
  Decrease = 'decrease',
  Increase = 'increase',
  SoldOut = 'soldOut',
  Push = 'push',
}

interface Sale {
  end: Date;
  priceEth: BN;
  tokensForSale: number;
  tokensSold: number;
}

interface Props {
  salesData: Sale[];
  symbol: string;
}

const SALE_STATUS_TEXT: Record<SaleStatus, MessageDescriptor> = {
  [SaleStatus.Decrease]: MSG.decrease,
  [SaleStatus.Increase]: MSG.increase,
  [SaleStatus.Push]: MSG.push,
  [SaleStatus.SoldOut]: MSG.soldOut,
};

const SALE_STATUS_CLASS: Record<SaleStatus, string> = {
  [SaleStatus.Decrease]: styles.decrease,
  [SaleStatus.Increase]: styles.increase,
  [SaleStatus.Push]: styles.push,
  [SaleStatus.SoldOut]: styles.soldOut,
};

const SALE_STATUS_ICON: Record<
  Exclude<SaleStatus, SaleStatus.SoldOut>,
  string
> = {
  [SaleStatus.Decrease]: 'triangle-down',
  [SaleStatus.Increase]: 'triangle-up',
  [SaleStatus.Push]: 'square',
};

const getSaleStatus = (price: BN, prevPrice?: BN): SaleStatus => {
  if (!prevPrice) {
    return SaleStatus.Push;
  }
  if (price.lt(prevPrice)) {
    return SaleStatus.Decrease;
  }
  if (price.gt(prevPrice)) {
    return SaleStatus.Increase;
  }
  return SaleStatus.Push;
};

const displayName = 'dashboard.CoinMachine.PreviousSales';

const PreviousSales = ({ salesData, symbol }: Props) => {
  const [containerRef, { height: containerHeight }] = useMeasure<
    HTMLDivElement
  >();
  const [headingRef, { height: headingHeight }] = useMeasure<HTMLDivElement>();
  const [tableHeadingRef, { height: tableHeadingHeight }] = useMeasure<
    HTMLTableRowElement
  >();

  // @Note: Necessary to make table body scrollable with fixed heading
  const tableWindowHeight = useMemo(
    // minus 15px for bottom padding within scrollable area
    () => containerHeight - headingHeight - tableHeadingHeight - 35,
    [containerHeight, headingHeight, tableHeadingHeight],
  );
  return (
    <div className={styles.main} ref={containerRef}>
      <Card className={styles.card}>
        <div ref={headingRef}>
          <Heading
            appearance={{ size: 'normal', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
        <div
          className={styles.tableContainer}
          style={{ maxHeight: `${tableWindowHeight}px` }}
        >
          <Table appearance={{ theme: 'transparent' }}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>
                  <div ref={tableHeadingRef}>
                    <FormattedMessage {...MSG.tableHeaderEnd} />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>
                  <FormattedMessage
                    {...MSG.tableHeaderAmount}
                    values={{
                      symbol: <span className={styles.muted}>{symbol}</span>,
                    }}
                  />
                </TableHeaderCell>
                <TableHeaderCell>
                  <FormattedMessage
                    {...MSG.tableHeaderPrice}
                    values={{
                      symbol: <span className={styles.muted}>ETH</span>,
                    }}
                  />
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            {salesData.length > 0 && (
              <TableBody className={styles.tableBody}>
                {salesData.map(
                  ({ end, priceEth, tokensForSale, tokensSold }, idx) => {
                    const { priceEth: prevPrice } = salesData[idx + 1] || {};
                    const saleStatus = getSaleStatus(priceEth, prevPrice);
                    const isSoldOut = tokensSold === tokensForSale;
                    return (
                      <TableRow
                        className={SALE_STATUS_CLASS[saleStatus]}
                        key={end.toISOString()}
                      >
                        <TableCell>
                          <FormattedDate
                            day="numeric"
                            month="2-digit"
                            value={end}
                          />{' '}
                          <FormattedTime
                            hour="2-digit"
                            minute="numeric"
                            value={end}
                          />
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              isSoldOut ? styles.soldOutText : undefined
                            }
                          >
                            <FormattedMessage
                              {...(isSoldOut ? MSG.soldOut : MSG.numberSold)}
                              values={{
                                tokensForSale: (
                                  <FormattedNumber value={tokensForSale} />
                                ),
                                tokensSold: (
                                  <FormattedNumber value={tokensSold} />
                                ),
                              }}
                            />
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={styles.priceCellText}>
                            {/* Always `DEFAULT_TOKEN_DECIMALS`
                                as it's always ETH */}
                            <Numeral
                              unit={DEFAULT_TOKEN_DECIMALS}
                              value={priceEth}
                            />
                          </span>
                          <span className={styles.priceCellIcon}>
                            {isSoldOut ? (
                              ' 🚀'
                            ) : (
                              <span className={styles.icon}>
                                <Icon
                                  appearance={{ size: 'extraTiny' }}
                                  name={SALE_STATUS_ICON[saleStatus]}
                                  title={SALE_STATUS_TEXT[saleStatus]}
                                />
                              </span>
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </Card>
    </div>
  );
};

PreviousSales.displayName = displayName;

export default PreviousSales;
