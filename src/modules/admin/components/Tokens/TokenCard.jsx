/* @flow */

import React, { Component, Fragment } from 'react';
import { withProps } from 'recompose';

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
  ethUsd: number | null,
};

type EthUsdResponse = {
  status: string,
  message: string,
  result: {
    ethbtc: string,
    ethbtc_timestamp: string,
    ethusd: string,
    ethusd_timestamp: string,
  },
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

  convertBalanceToUsd = (ethUsdConversionRate: number): number => {
    const {
      token: { balance },
    } = this.props;
    return +(balance * ethUsdConversionRate).toFixed(2);
  };

  getEthToUsd = () => {
    const ethUsdKey = `${displayName}.ethUsd`;
    const ethUsdTimestampKey = `${displayName}.ethUsdTimestamp`;

    const conversionRateEndpoint =
      'https://api.etherscan.io/api?module=stats&action=ethprice';

    const cachedEthUsd = localStorage.getItem(ethUsdKey) || null;
    if (cachedEthUsd) {
      this.setState({
        ethUsd: this.convertBalanceToUsd(Number(cachedEthUsd)),
      });
    }
    const cachedEthUsdTimestamp = localStorage.getItem(ethUsdTimestampKey);
    const currentTimestamp = new Date().getTime();
    if (
      !cachedEthUsdTimestamp ||
      currentTimestamp - Number(cachedEthUsdTimestamp) > 10000
    ) {
      fetch(conversionRateEndpoint)
        .then(response => {
          if (!response.ok) {
            throw Error(`${displayName}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((response: EthUsdResponse) => {
          const {
            result: { ethusd: ethUsd },
            status,
          } = response;
          if (status !== '1') {
            throw Error(`${displayName}: Invalid response data.`);
          }
          localStorage.setItem(ethUsdKey, ethUsd);
          localStorage.setItem(ethUsdTimestampKey, currentTimestamp.toString());
          this.setState({
            ethUsd: this.convertBalanceToUsd(Number(ethUsd)),
          });
        })
        .catch(console.warn);
    }
  };

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
        <div className={styles.balanceContent}>{balance}</div>
        <div className={styles.cardFooter}>
          {isEth && (
            <Fragment>
              {ethUsd ? (
                <Numeral value={ethUsd} prefix="~ " suffix=" USD" />
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
