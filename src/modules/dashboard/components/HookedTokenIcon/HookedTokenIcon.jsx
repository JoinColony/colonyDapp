/* @flow */
// $FlowFixMe
import React, { useState, useEffect } from 'react';
import mapping from 'eth-contract-metadata';

import type { ComponentType } from 'react';
import type { Props as TokenIconProps } from '~core/TokenIcon';
import TokenIcon from '~core/TokenIcon';

import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../core/fetchers';

type ImageType = { default: string } | { default: () => ComponentType<*> };

const checkSVG = (fileName: string) =>
  fileName &&
  fileName.substring(fileName.length - 3, fileName.length) === 'svg';

const loadTokenImages = async (
  logo,
): Promise<ImageType> /* eslint-disable max-len */ =>
  import(/* webpackMode: "eager" */ `../../../../../node_modules/eth-contract-metadata/images/${logo}`);
const HookedTokenIcon = ({ token, ...props }: TokenIconProps) => {
  const { iconHash, address } = token;
  const [tokenImage, setTokenImage] = useState();
  const [tokenSVG, setTokenSVG] = useState();
  const { data: ipfsIcon } = useDataFetcher<string>(
    ipfsDataFetcher,
    [iconHash],
    [iconHash],
  );

  /* Here we will pick the right solution to show
   *  the token icons depending from if they are png or svg or a blockie
   *  case 1: if it's a .png we can just pass through the tokenImage
   *  case 2: it's an svg and we just import it manually
   *  case 3: there's no data about the token icon and we show a blockie
   *  case 4: if there's an ipfsHash show the concerning image
   */

  useEffect(
    () => {
      const checkAndLoadImages = async () => {
        if (ipfsIcon || tokenImage || tokenSVG) {
          return;
        }

        const metaData = mapping[address];

        if (metaData) {
          const response = await loadTokenImages(metaData.logo);
          if (response) {
            if (checkSVG(metaData.logo) && response) {
              setTokenSVG(response.default);
            } else {
              setTokenImage(response.default);
            }
          }
        }
      };
      checkAndLoadImages();
    },
    [ipfsIcon, tokenImage, setTokenImage, address, tokenSVG],
  );

  return (
    <TokenIcon
      token={token}
      iconURL={tokenImage || ipfsIcon || undefined}
      {...props}
    >
      {tokenSVG}
    </TokenIcon>
  );
};

export default HookedTokenIcon;
