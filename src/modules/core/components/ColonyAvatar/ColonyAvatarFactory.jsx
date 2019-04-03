/* @flow */

import React from 'react';

import type { ColonyType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';

import { colonyFetcher } from '../../../dashboard/fetchers';
import { ipfsDataFetcher } from '../../fetchers';
import useColonyENSName from '../../../dashboard/components/ColonyGrid/useColonyENSName';

import ColonyAvatarDisplay from './ColonyAvatarDisplay.jsx';

type FactoryOpts = {|
  /** Try to fetch colony using a data fetcher */
  fetchColony?: boolean,
  /** Try to fetch the avatar using a data fetcher */
  fetchAvatar?: boolean,
|};

export type Props = {|
  /** Address of the colony for identicon fallback */
  address: string,
  /** Avatar image URL (can be a base64 encoded string) */
  avatar?: string,
  /** Is passed through to Avatar */
  className?: string,
  /** Avatars that are not set have a different placeholder */
  notSet?: boolean,
  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl',
  /** The corresponding colony object if available */
  colony?: $Shape<ColonyType>,
|};

const displayName = 'ColonyAvatar';

const ColonyAvatarFactory = ({
  fetchColony = true,
  fetchAvatar = true,
}: FactoryOpts = {}) => {
  const ColonyAvatar = ({
    address,
    avatar: avatarProp,
    colony: colonyProp,
    ...rest
  }: Props) => {
    let colony = colonyProp;
    let avatar = avatarProp;

    if (fetchColony) {
      // TODO: as of #1032 we can look up colony by address
      const { data: ensName } = useColonyENSName(address);
      ({ data: colony } = useDataFetcher<ColonyType>(
        colonyFetcher,
        [ensName],
        [ensName],
      ));
    }
    if (fetchAvatar) {
      const avatarIpfsHash = colony ? colony.avatar : undefined;
      ({ data: avatar } = useDataFetcher<string>(
        ipfsDataFetcher,
        [avatarIpfsHash],
        [avatarIpfsHash],
      ));
    }

    return (
      <ColonyAvatarDisplay
        address={address}
        avatar={avatar}
        colony={colony}
        {...rest}
        notSet={!colony}
      />
    );
  };

  ColonyAvatar.displayName = displayName;

  return ColonyAvatar;
};

export default ColonyAvatarFactory;
