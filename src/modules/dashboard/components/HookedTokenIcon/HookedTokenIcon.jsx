/* @flow */

import React from 'react';

import type { Props as TokenIconProps } from '~core/TokenIcon';
import TokenIcon from '~core/TokenIcon';

import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../core/fetchers';

const HookedTokenIcon = ({ token, ...props }: TokenIconProps) => {
  const { iconHash } = token;
  const { data } = useDataFetcher<string>(
    ipfsDataFetcher,
    [iconHash],
    [iconHash],
  );

  // This is needed for flow for some reason (terrible)
  const iconURL = data || undefined;
  return <TokenIcon token={token} iconURL={iconURL} {...props} />;
};

export default HookedTokenIcon;
