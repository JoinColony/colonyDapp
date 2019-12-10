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
    WORK_REQUEST_CREATED: { inherits: 'send-task-work-request' },
    'create-task': { inherits: 'is-admin' },
    'send-task-work-request': async () => true,
    'update-task': { inherits: 'is-admin' },
  };
}
