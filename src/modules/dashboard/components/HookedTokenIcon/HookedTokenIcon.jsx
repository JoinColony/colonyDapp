/* @flow */

import React from 'react';
import mapping from 'eth-contract-metadata';

import type { Props as TokenIconProps } from '~core/TokenIcon';
import TokenIcon from '~core/TokenIcon';

import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../core/fetchers';

type FileType = 'svg' | 'png';

const checkFileExtension = (fileName: string): FileType =>
  fileName && fileName.substring(fileName.length - 3, fileName.length);

const loadTokenImages = async (logo /* webpackMode: "eager" */) =>
  import(`../../../../../node_modules/eth-contract-metadata/images/${logo}`);

const HookedTokenIcon = ({ token, ...props }: TokenIconProps) => {
  const { iconHash, address } = token;
  const { data } = useDataFetcher<string>(
    ipfsDataFetcher,
    [iconHash],
    [iconHash],
  );

  const renderTokenIcon = (iconURL, svg) => (
    <TokenIcon token={token} iconURL={iconURL} component={svg} {...props} />
  );

  // This is needed for flow for some reason (terrible)
  let iconURL = data || undefined;

  /* Here we will pick the right solution to show
   *  the token icons depending from if they are png or svg or a blockie
   *  case 1: if it's a .png we can just pass through the iconUrl
   *  case 2: it's an svg and we just import it manually
   *  case 3: there's no data about the token icon and we show a blockie
   */

  let svg;
  const metaData = mapping['0x150b0b96933B75Ce27af8b92441F8fB683bF9739'];
  /* If there is external tokens there will be metaData */
  if (metaData) {
    const fileType = checkFileExtension(metaData.logo);
    switch (fileType) {
      case 'png':
        return loadTokenImages(metaData.logo).then(file => {
          iconURL = file.default;
          return renderTokenIcon(iconURL, svg);
        });
        break;
      case 'svg':
        return loadTokenImages(metaData.logo).then(file => {
          svg = file.default;
          return renderTokenIcon(iconURL, svg);
        });
        break;
      default:
    }
  } else {
    return (
      <TokenIcon token={token} iconURL={iconURL} component={svg} {...props} />
    );
  }
};

export default HookedTokenIcon;
