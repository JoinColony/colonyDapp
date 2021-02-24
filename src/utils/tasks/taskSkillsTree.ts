import { Network } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';

import mainnetTaskSkillsTree from './taskSkillsTree.mainnet';
import goerliTaskSkillsTree from './taskSkillsTree.goerli';
import xdaiTaskSkillsTree from './taskSkillsTree.xdai';
import localTaskSkillsTree from './taskSkillsTree.local';

const getTaskSkillsTreeInUse = () => {
  switch (DEFAULT_NETWORK) {
    case Network.Mainnet:
      return mainnetTaskSkillsTree;
    case Network.Goerli:
      return goerliTaskSkillsTree;
    case Network.Xdai:
      return xdaiTaskSkillsTree;
    default:
      return localTaskSkillsTree;
  }
};

export default getTaskSkillsTreeInUse();
