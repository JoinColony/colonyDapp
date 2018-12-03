/* @flow */

import { List } from 'immutable';

import { Colony, ColonyMeta } from '../modules/core/records';

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
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      ensName: 'zirtual',
      id: 4,
    }),
  }),
  Colony({
    name: 'C21t',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      ensName: 'c21t',
      id: 5,
    }),
  }),
  Colony({
    name: 'Twitch.tv',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      ensName: 'twitch-tv',
      id: 6,
    }),
  }),
  Colony({
    name: 'Zirtual',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      ensName: 'zirtual',
      id: 7,
    }),
  }),
  Colony({
    name: 'C21t',
    meta: ColonyMeta({
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      ensName: 'c21t',
      id: 8,
    }),
  }),
);

export default mockColonies;
