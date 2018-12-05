/* @flow */
import type { IntlShape } from 'react-intl';

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
  /** Value in ether to convert to USD */
  value: number,
  /** @ignore injected by `injectIntl` */
  intl: IntlShape,
};

type State = {
  valueUsd: number | null,
};

class EthUsd extends Component<Props, State> {
  static displayName = 'EthUsd';

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
      intl: { formatMessage },
      value,
      ...rest
    } = this.props;
    const suffix = formatMessage(MSG.usdAbbreviation);
    return valueUsd ? (
      <Numeral
        appearance={appearance}
        decimals={2}
        prefix="~ "
        suffix={` ${suffix}`}
        value={valueUsd}
        {...rest}
      />
    ) : (
      <SpinnerLoader />
    );
  }
}

export default injectIntl(EthUsd);
