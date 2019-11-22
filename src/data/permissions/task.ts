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
    DUE_DATE_SET: { inherits: 'set-task-due-date' },
    DOMAIN_SET: { inherits: 'set-task-domain' },
    PAYOUT_SET: { inherits: 'set-task-payout' },
    PAYOUT_REMOVED: { inherits: 'set-task-payout' },
    SKILL_SET: { inherits: 'set-task-skill' },
    TASK_CANCELLED: { inherits: 'cancel-task' },
    TASK_CLOSED: { inherits: 'close-task' },
    TASK_CREATED: { inherits: 'create-task' },
    TASK_DESCRIPTION_SET: { inherits: 'update-task' },
    TASK_FINALIZED: { inherits: 'finalize-task' },
    TASK_TITLE_SET: { inherits: 'update-task' },
    WORK_INVITE_SENT: { inherits: 'send-task-work-invite' },
    WORK_REQUEST_CREATED: { inherits: 'send-task-work-request' },
    WORKER_ASSIGNED: { inherits: 'set-task-assignee' },
    WORKER_UNASSIGNED: { inherits: 'remove-task-assignee' },
    'cancel-task': { inherits: 'is-admin' },
    'create-task': { inherits: 'is-admin' },
    'finalize-task': { inherits: 'is-admin' },
    'remove-task-assignee': { inherits: 'is-admin' },
    'send-task-work-invite': { inherits: 'is-admin' },
    'send-task-work-request': async () => true,
    'set-task-assignee': { inherits: 'is-admin' },
    // disallow changing of the domain for now
    'set-task-domain': async () => false,
    // 'set-task-domain': async (userAddress, { event }) => {
    //   // Ideally, this would also check the current domainId; this has to
    //   // be done outside of the action controller, because Orbit only passes
    //   // the current entry to the `canAppend` method.
    //   return event && event.type === EventTypes.DOMAIN_SET
    //     ? isAdminOrFounder(userAddress, event.payload.domainId)
    //     : false;
    // },
    'set-task-due-date': { inherits: 'is-admin' },
    'set-task-payout': { inherits: 'is-admin' },
    'set-task-skill': { inherits: 'is-admin' },
    'update-task': { inherits: 'is-admin' },
  };
}
