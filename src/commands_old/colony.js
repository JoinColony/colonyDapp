/* @flow */
/* eslint-disable flowtype/generic-spacing */

import * as yup from 'yup';

import type { DDB } from '../../../lib/database';
import type { ENSName } from '~types';
import type { CommandSpec } from '../../execution';

import { getStore, createStore } from '../../application/stores';

export const createColonyStore: CommandSpec<{
  colonyENSName: ENSName,
  ddb: DDB,
}> = {
  blueprint: {},
  schema: yup.object({
    colonyENSName: yup.string().required(),
    ddb: yup.object().required(),
  }),
  async execute({ colonyENSName, ddb }) {
    return createStore(ddb)(this.blueprint, { colonyENSName });
  },
};

export const getColonyStore: CommandSpec<{
  colonyENSName: ENSName,
  colonyStoreAddress: string,
  ddb: DDB,
}> = {
  blueprint: {},
  schema: yup.object({
    colonyENSName: yup.string().required(),
    colonyStoreAddress: yup.string().required(),
    ddb: yup.object().required(),
  }),
  async execute({ colonyENSName, colonyStoreAddress, ddb }) {
    return getStore(ddb)(this.blueprint, colonyStoreAddress, { colonyENSName });
  },
};
