import { TaskEvents } from '~data/types/TaskEvents';
import { Address, PermissionsManifest } from '~types/index';

export default function loadModule(): PermissionsManifest<{
  domainId?: number;
  colonyAddress?: Address;
  event?: TaskEvents;
  heads?: object[];
}> {
  return {
    COMMENT_STORE_CREATED: { inherits: 'create-task' },
    TASK_CREATED: { inherits: 'create-task' },
    'create-task': { inherits: 'is-admin' },
    'update-task': { inherits: 'is-admin' },
  };
}
