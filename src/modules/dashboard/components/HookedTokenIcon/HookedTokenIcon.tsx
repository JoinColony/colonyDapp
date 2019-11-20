import React, { useState, useEffect, ComponentType } from 'react';
import mapping from 'eth-contract-metadata';

import TokenIcon, { Props as TokenIconProps } from '~core/TokenIcon';
import { useDataFetcher } from '~utils/hooks';
import { tokenIsETH } from '../../../core/checks';
import { ipfsDataFetcher } from '../../../core/fetchers';

interface ImageType {
  default: string | (() => ComponentType<any>);
}

const checkSVG = (fileName: string) =>
  fileName &&
  fileName.substring(fileName.length - 3, fileName.length) === 'svg';

const loadTokenImages = async (logo): Promise<ImageType> =>
  import(
    /* webpackMode: "eager" */ `../../../../../node_modules/eth-contract-metadata/images/${logo}`
  );

const HookedTokenIcon = ({ token, ...props }: TokenIconProps) => {
  const { iconHash, address } = token;
  const [tokenImage, setTokenImage] = useState();
  const [tokenSVG, setTokenSVG] = useState();
  const { data: ipfsIcon } = useDataFetcher(
    ipfsDataFetcher,
    [iconHash as string], // Technically a bug, shouldn't need type override
    [iconHash],
  );

  /* Here we will pick the right solution to show
   *  the token icons depending from if they are png or svg or a blockie
   *  case 1: if it's a .png we can just pass through the tokenImage
   *  case 2: it's an svg and we just import it manually
   *  case 3: there's no data about the token icon and we show a blockie
   *  case 4: if there's an ipfsHash show the concerning image
   */

  useEffect(() => {
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
      if (tokenIsETH({ address })) {
        const response = await import(
          /* webpackMode: "eager" */ `../../../../img/tokens/ether.svg`
        );
        setTokenSVG(response.default);
      }
    };
    checkAndLoadImages();
  }, [ipfsIcon, tokenImage, setTokenImage, address, tokenSVG]);

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
