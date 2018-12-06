/* @flow */
import type { IntlShape } from 'react-intl';
import BN from 'bn.js';

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';

import { getEthToUsd } from '~utils/external';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';

const MSG = defineMessages({
  usdAbbreviation: {
    id: 'EthUsd.usdAbbreviation',
    defaultMessage: 'USD',
  },
});

type Appearance = {
  theme: 'primary' | 'grey' | 'dark',
  size: 'medium' | 'large' | 'small',
};

type Props = {
  /** Appearance object for numeral */
  appearance?: Appearance,
  /** Number of decimals to show */
  decimals: number,
  /** Should the prefix be visible? */
  showPrefix: boolean,
  /** Should the suffix be visible? */
  showSuffix: boolean,
  /** Value in ether to convert to USD */
  value: number | string | BN,
  /** @ignore injected by `injectIntl` */
  intl: IntlShape,
};

type State = {
  valueUsd: number | null,
};

class EthUsd extends Component<Props, State> {
  static displayName = 'EthUsd';

  static defaultProps = {
    decimals: 2,
    showPrefix: true,
    showSuffix: true,
  };

  state = {
    valueUsd: null,
  };

  componentDidMount() {
    this.convertEthToUsd();
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.convertEthToUsd();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean = false;

  convertEthToUsd = () => {
    const { value } = this.props;
    this.mounted = true;
    getEthToUsd(value).then(valueUsd => {
      if (this.mounted) {
        this.setState({
          valueUsd,
        });
      }
    });
  };

  render() {
    const { valueUsd } = this.state;
    const {
      appearance,
      decimals,
      intl: { formatMessage },
      showPrefix,
      showSuffix,
      value,
      ...rest
    } = this.props;
    const suffixText = formatMessage(MSG.usdAbbreviation);
    return valueUsd ? (
      <Numeral
        appearance={appearance}
        decimals={decimals}
        prefix={showPrefix ? '~ ' : ''}
        suffix={showSuffix ? ` ${suffixText}` : ''}
        value={valueUsd}
        {...rest}
      />
    ) : (
      <SpinnerLoader />
    );
  }
}

export default injectIntl(EthUsd);
