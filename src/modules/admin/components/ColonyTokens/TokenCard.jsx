/* @flow */

import React, { Component, Fragment } from 'react';
import { withProps } from 'recompose';

import type { Token } from './types';

import Card from '~core/Card';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './TokenCard.css';

type InProps = {
  token: Token,
};

type OutProps = {
  isEth: boolean,
};

type Props = InProps & OutProps;

type State = {
  ethUsd: number | null,
};

class TokenCard extends Component<Props, State> {
  timeoutId: TimeoutID;

  static displayName = 'admin.ColonyTokens.TokenCard';

  state = { ethUsd: null };

  componentDidMount() {
    const { isEth } = this.props;
    /*
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
      token: { id: tokenId, icon, tokenSymbol, isNative, balance },
    } = this.props;
    const { ethUsd } = this.state;
    return (
      <Card key={tokenId} className={styles.main}>
        <div className={styles.cardHeading}>
          {!!icon && (
            <div className={styles.iconContainer}>
              <Icon
                name="metamask"
                title={tokenSymbol}
                appearance={{ size: 'medium' }}
              />
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

const enhance = withProps(
  ({ token: { tokenSymbol } }: InProps): OutProps => ({
    isEth: tokenSymbol.toLowerCase() === 'eth',
  }),
);

export default enhance(TokenCard);
