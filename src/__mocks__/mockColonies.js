/* @flow */

import { List } from 'immutable';

import { Colony, ColonyMeta } from '~immutable';

const mockColonies = List.of(
  Colony({
    name: 'Twitch.tv',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      ensName: 'twitch-tv',
      id: 4,
    }),
  }),
  Colony({
    name: 'Zirtual',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      ensName: 'zirtual',
      id: 4,
    }),
  }),
  Colony({
    name: 'C21t',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989c',
      ensName: 'c21t',
      id: 5,
    }),
  }),
  Colony({
    name: 'Twitch.tv',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989d',
      ensName: 'twitch-tv',
      id: 6,
    }),
  }),
  Colony({
    name: 'Zirtual',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989e',
      ensName: 'zirtual',
      id: 7,
    }),
  }),
  Colony({
    name: 'C21t',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989f',
      ensName: 'c21t',
      id: 8,
    }),
  }),
);

export default mockColonies;
