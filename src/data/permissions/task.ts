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
    PAYOUT_SET: { inherits: 'set-task-payout' },
    PAYOUT_REMOVED: { inherits: 'set-task-payout' },
    TASK_CLOSED: { inherits: 'close-task' },
    TASK_CREATED: { inherits: 'create-task' },
    WORK_REQUEST_CREATED: { inherits: 'send-task-work-request' },
    WORKER_ASSIGNED: { inherits: 'set-task-assignee' },
    WORKER_UNASSIGNED: { inherits: 'remove-task-assignee' },
    'create-task': { inherits: 'is-admin' },
    'remove-task-assignee': { inherits: 'is-admin' },
    'send-task-work-request': async () => true,
    'set-task-assignee': { inherits: 'is-admin' },
    'set-task-payout': { inherits: 'is-admin' },
    'update-task': { inherits: 'is-admin' },
  };
}
