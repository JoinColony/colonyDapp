/* @flow */
import React from 'react';
import type { ComponentType } from 'react';

import WalletConnectTemplate from '../../../pages/components/WalletConnectTemplate';

type Props = {
  ProviderComponent: ComponentType<any>
}

const withProvider = ({ProviderComponent}: Props) => (
  <WalletConnectTemplate>
    <ProviderComponent />
  </WalletConnectTemplate>
);

export default withProvider;