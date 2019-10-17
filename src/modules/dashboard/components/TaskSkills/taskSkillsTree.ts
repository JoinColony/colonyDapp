import { DEFAULT_NETWORK } from '~constants';

import mainnetTaskSkillsTree from './taskSkillsTree.mainnet';
import goerliTaskSkillsTree from './taskSkillsTree.goerli';
import localTaskSkillsTree from './taskSkillsTree.local';

const getTaskSkillsTreeInUse = () => {
  switch (DEFAULT_NETWORK) {
    case 'mainnet':
      return mainnetTaskSkillsTree;
    case 'goerli':
      return goerliTaskSkillsTree;
    default:
      return localTaskSkillsTree;
  }
};

export default getTaskSkillsTreeInUse();
