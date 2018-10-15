/* @flow */

import React, { Component, Fragment } from 'react';
import { withProps } from 'recompose';

import type { Token } from './types';

import Card from '~core/Card';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './TokenCard.css';

type InProps = {
  token: Token,
};

type Props = InProps & {
  isEth: boolean,
};

type State = {
  ethUsd: number | null,
};

class TokenCard extends Component<Props, State> {
  timeoutId: TimeoutID;

  static displayName = 'admin.Tokens.TokenCard';

  state = { ethUsd: null };

  componentDidMount() {
    const { isEth } = this.props;
    /*
     * TODO retrieve tokenIcon image data from ipfs. Currently using mock data.
     *
     * TODO either look up ethUsd or remove this. Also update required `Numeral` below.
     */
    if (isEth) {
      const ethUsd = 201.34;
      this.timeoutId = setTimeout(() => {
        this.setState({
          ethUsd,
        });
      }, 2000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  render() {
    const {
      isEth,
      token: { id: tokenId, tokenIcon, tokenSymbol, isNative, balance },
    } = this.props;
    const { ethUsd } = this.state;
    return (
      <Card key={tokenId} className={styles.main}>
        <div className={styles.cardHeading}>
          {!!tokenIcon && (
            <div className={styles.iconContainer}>
              <img src={tokenIcon.data} alt={tokenIcon.name} />
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
