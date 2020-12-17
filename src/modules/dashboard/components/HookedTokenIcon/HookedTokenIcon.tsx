import React, { useState, useEffect } from 'react';
import { Network } from '@colony/colony-js';

import { AddressZero } from 'ethers/constants';
import { TOKEN_LOGOS_REPO_URL, DEFAULT_NETWORK } from '~constants';

import Avatar from '~core/Avatar';
import { useDataFetcher } from '~utils/hooks';
import { AnyToken } from '~data/index';
import { Address } from '~types/index';
import Icon from '~core/Icon';
import { getBase64image } from '~utils/dataReader';

import { ipfsDataFetcher } from '../../../core/fetchers';

interface Response {
  url: string;
  ok: boolean;
  blob: any;
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

  /** If true logo fetching wont be fire */
  dontFetch?: boolean;
}

const ICON_STORAGE = 'tokenImages';

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
  dontFetch = DEFAULT_NETWORK !== Network.Mainnet,
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
      const imagesStorage = localStorage.getItem(ICON_STORAGE);
      const parsedImagesStorage = imagesStorage && JSON.parse(imagesStorage);
      if (parsedImagesStorage) {
        const image = parsedImagesStorage[address];
        if (image) {
          setTokenImage(image);
          return;
        }
      }

      if (!dontFetch && address && !iconName) {
        const response = await loadTokenImages(address);
        if (response.ok) {
          const blob = await response.blob();
          const base64image = await getBase64image(blob);
          if (base64image) {
            if (parsedImagesStorage) {
              parsedImagesStorage[address] = base64image;
              localStorage.setItem(
                ICON_STORAGE,
                JSON.stringify(parsedImagesStorage),
              );
            } else {
              localStorage.setItem(
                ICON_STORAGE,
                JSON.stringify({ [address]: base64image }),
              );
            }
            setTokenImage(base64image);
          }
        }
      }
    };
    loadTokenLogo();
  }, [address, iconName, dontFetch]);

  return (
    <>
      {iconName ? (
        <Icon name={iconName} title={name || address} {...props} />
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
