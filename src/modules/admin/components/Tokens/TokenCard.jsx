/* @flow */

import React, { Component, Fragment } from 'react';
import { withProps } from 'recompose';

import { getEthToUsd } from '~utils/external';

import type { TokenType } from '~types/token';

import Card from '~core/Card';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './TokenCard.css';

type InProps = {
  token: TokenType,
};

type Props = InProps & {
  isEth: boolean,
};

type State = {
  ethUsd: number | null | string,
};

const displayName = 'admin.Tokens.TokenCard';

class TokenCard extends Component<Props, State> {
  static displayName = displayName;

  state = { ethUsd: null };

  componentDidMount() {
    const { isEth } = this.props;
    if (isEth) {
      this.getEthToUsd();
    }
  }

  isNotPositive = number => Number(number) <= 0;

  convertBalanceToUsd = (ethUsdConversionRate: number): number => {
    const {
      isEth,
      token: { balance },
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
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted = false;

  render() {
    const {
      isEth,
      token: {
        id: tokenId,
        tokenIcon,
        tokenName,
        tokenSymbol,
        isNative,
        balance,
      },
    } = this.props;
    const { ethUsd } = this.state;
    return (
      <Card key={tokenId} className={styles.main}>
        <div className={styles.cardHeading}>
          {!!tokenIcon && (
            <div className={styles.iconContainer}>
              <img src={tokenIcon} alt={tokenName} />
            </div>
          )}
          <div className={styles.tokenSymbol}>
            {tokenSymbol}
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

const enhance = withProps(({ token: { tokenSymbol } }: InProps) => ({
  isEth: !!tokenSymbol && tokenSymbol.toLowerCase() === 'eth',
}));

export default enhance(TokenCard);
