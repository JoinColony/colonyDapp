import React, { useState, useEffect, ComponentType } from 'react';
import { AddressZero } from 'ethers/constants';

import Avatar from '~core/Avatar';
import { useDataFetcher } from '~utils/hooks';
import { AnyToken } from '~data/index';

import { ipfsDataFetcher } from '../../../core/fetchers';

interface ImageType {
  default: string | (() => ComponentType<any>);
}

interface Props {
  /** Token reference to display */
  token: AnyToken;

  /** Is passed through to Avatar */
  className?: string;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** Optional name for the icon title */
  name?: string;
}

const loadTokenImages = async (logo): Promise<ImageType> =>
  import(
    /* webpackMode: "eager" */ `../../../../../node_modules/eth-contract-metadata/images/${logo}`
  );

const HookedTokenIcon = ({
  name,
  token: { iconHash, address },
  ...props
}: Props) => {
  const [tokenImage, setTokenImage] = useState<string | undefined>();
  const { data: ipfsIcon } = useDataFetcher(
    ipfsDataFetcher,
    [iconHash as string], // Technically a bug, shouldn't need type override
    [iconHash],
  );

  return (
    <Avatar
      avatarURL={tokenImage || ipfsIcon || undefined}
      placeholderIcon="circle-close"
      seed={address}
      title={name || address}
      {...props}
    />
  );
};

export default HookedTokenIcon;
