import React, { useState, useEffect } from 'react';
import { AddressZero } from 'ethers/constants';

import Avatar from '~core/Avatar';
import { useDataFetcher } from '~utils/hooks';
import { AnyToken } from '~data/index';
import { Address } from '~types/index';
import Icon from '~core/Icon';

import { ipfsDataFetcher } from '../../../core/fetchers';

interface Response {
  url: string;
  ok: boolean;
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

  /** If provided than icon is display instead of Avatar */
  iconName?: string;
}

const TOKEN_LOGOS_REPO_URL =
  'https://raw.githubusercontent.com/trustwallet' +
  '/assets/master/blockchains/ethereum/';

const loadTokenImages = async (address: Address): Promise<Response> => {
  let tokenImageUrl = `${TOKEN_LOGOS_REPO_URL}${address}/logo.png`;
  if (address === AddressZero) {
    tokenImageUrl = `${TOKEN_LOGOS_REPO_URL}info/logo.png`;
  }
  return fetch(tokenImageUrl);
};

const HookedTokenIcon = ({
  name,
  token: { iconHash, address },
  iconName,
  ...props
}: Props) => {
  const [tokenImage, setTokenImage] = useState<string | undefined>();
  const { data: ipfsIcon } = useDataFetcher(
    ipfsDataFetcher,
    [iconHash as string], // Technically a bug, shouldn't need type override
    [iconHash],
  );

  useEffect(() => {
    const loadTokenLogo = async () => {
      if (address && !iconName) {
        const response = await loadTokenImages(address);
        if (!response.ok) {
          return;
        }
        setTokenImage(response.url);
      }
    };
    loadTokenLogo();
  }, [address, iconName]);

  return (
    <>
      {iconName ? (
        <Icon
          appearance={{ size: 'medium' }}
          name={iconName}
          title={iconName}
        />
      ) : (
        <Avatar
          avatarURL={tokenImage || ipfsIcon || undefined}
          placeholderIcon="circle-close"
          seed={address}
          title={name || address}
          {...props}
        />
      )}
    </>
  );
};

export default HookedTokenIcon;
