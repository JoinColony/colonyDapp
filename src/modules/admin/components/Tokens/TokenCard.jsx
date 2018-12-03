/* @flow */

import React, { Component, Fragment } from 'react';

import { getEthToUsd } from '~utils/external';

// import { Token } from '~immutable';
import type { TokenRecord } from '~types';

import Card from '~core/Card';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './TokenCard.css';

type Props = {
  token: TokenRecord,
};

type State = {
  ethUsd: number | null,
};

const displayName = 'admin.Tokens.TokenCard';

class TokenCard extends Component<Props, State> {
  static displayName = displayName;

  state = { ethUsd: null };

  componentDidMount() {
    this.mounted = true;
    const {
      token: { isEth, balance },
    } = this.props;
    if (isEth) {
      getEthToUsd(balance).then(converted => {
        if (this.mounted) {
          this.setState({
            ethUsd: converted,
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  isNotPositive = (n: number) => Number(n) <= 0;

  mounted = false;

  render() {
    const {
      token: { balance, icon, id: tokenId, isEth, isNative, name, symbol },
    } = this.props;
    const { ethUsd } = this.state;
    return (
      <Card key={tokenId} className={styles.main}>
        <div className={styles.cardHeading}>
          {!!icon && (
            <div className={styles.iconContainer}>
              <img src={icon} alt={name} />
            </div>
          )}
          <div className={styles.symbol}>
            {symbol}
            {isNative && <span>*</span>}
          </div>
        </div>
        <div
          className={
            this.isNotPositive(balance)
              ? styles.balanceNotPositive
              : styles.balanceContent
          }
        >
          {balance.toFixed(2)}
        </div>
        <div className={styles.cardFooter}>
          {isEth && (
            <Fragment>
              {ethUsd === 0 || ethUsd ? (
                <Numeral
                  value={ethUsd}
                  prefix="~ "
                  suffix=" USD"
                  integerSeparator="."
                  decimals={2}
                />
              ) : (
                <SpinnerLoader />
              )}
            </Fragment>
          )}
        </div>
      </Card>
    );
  }
}

export default TokenCard;
