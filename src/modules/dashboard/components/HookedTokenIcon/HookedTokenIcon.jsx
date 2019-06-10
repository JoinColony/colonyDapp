/* @flow */

import React from 'react';
import tokenMap from 'eth-contract-metadata';

import type { Props as TokenIconProps } from '~core/TokenIcon';
import TokenIcon from '~core/TokenIcon';
import Icon from '../../../../../node_modules/eth-contract-metadata/images/dether.svg';
import PNG from '../../../../../node_modules/eth-contract-metadata/images/Mainframe.png';

import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../core/fetchers';

const checkFileExtension = fileName =>
  fileName && fileName.substring(fileName.length - 3, fileName.length);

const HookedTokenIcon = ({ token, ...props }: TokenIconProps) => {
  const { iconHash, address } = token;
  const { data } = useDataFetcher<string>(
    ipfsDataFetcher,
    [iconHash],
    [iconHash],
  );

  const metaData = tokenMap[address];

  type FileType = 'svg' | 'png';

  const TokenIconFile = metaData && metaData.logo ? metaData.logo : undefined;

  const fileType: FileType = checkFileExtension(TokenIconFile);

  /* Here we will pick the right solution to show
   *  the token icons depending from if they are png or svg
   *  case 1: if it's a .png we can just pass through the iconUrl
   *  case 2: it's an svg and we just import it manually
   */

  // This is needed for flow for some reason (terrible)
  const iconURL = data || PNG;
  console.log(Icon);
  return (
    <TokenIcon token={token} iconURL={iconURL} component={Icon} {...props} />
  );
};

export default HookedTokenIcon;
