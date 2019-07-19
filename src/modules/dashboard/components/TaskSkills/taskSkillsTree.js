/* @flow */

import mainnetTaskSkillsTree from './taskSkillsTree.mainnet';
import goerliTaskSkillsTree from './taskSkillsTree.goerli';
import localTaskSkillsTree from './taskSkillsTree.local';

import { DEFAULT_NETWORK } from '../../../core/constants';

// eslint-disable-next-line import/no-mutable-exports
let taskSkillsTreeInUse;

switch (DEFAULT_NETWORK) {
  case 'mainnet':
    taskSkillsTreeInUse = mainnetTaskSkillsTree;
    break;
  case 'goerli':
    taskSkillsTreeInUse = goerliTaskSkillsTree;
    break;
  default:
    taskSkillsTreeInUse = localTaskSkillsTree;
    break;
}

export default taskSkillsTreeInUse;
