/* @flow */

import type { PermissionsManifest } from './types';

export default function loadModule(): PermissionsManifest {
  return {
    COMMENT_STORE_CREATED: { inherits: 'create-task' },
    TASK_CREATED: { inherits: 'create-task' },
    TASK_UPDATED: { inherits: 'update-task' },
    DUE_DATE_SET: { inherits: 'set-task-due-date' },
    SKILL_SET: { inherits: 'set-task-skill' },
    PAYOUT_SET: { inherits: 'set-task-payout' },
    WORK_REQUEST_CREATED: { inherits: 'send-task-work-request' },
    WORK_INVITE_SENT: { inherits: 'send-task-work-invite' },
    TASK_CANCELLED: { inherits: 'cancel-task' },
    TASK_CLOSED: { inherits: 'close-task' },
    TASK_FINALIZED: { inherits: 'finalize-task' },
    WORKER_ASSIGNED: { inherits: 'set-task-assignee' },
    WORKER_UNASSIGNED: { inherits: 'remove-task-assignee' },
    'cancel-task': { inherits: 'is-colony-founder-or-admin' },
    'create-task': { inherits: 'is-colony-founder-or-admin' },
    'update-task': { inherits: 'is-colony-founder-or-admin' },
    'send-task-work-invite': { inherits: 'is-colony-founder-or-admin' },
    'send-task-work-request': async () => true,
    'set-task-due-date': { inherits: 'is-colony-founder-or-admin' },
    'set-task-skill': { inherits: 'is-colony-founder-or-admin' },
    'set-task-payout': { inherits: 'is-colony-founder-or-admin' },
    'set-task-assignee': { inherits: 'is-colony-founder-or-admin' },
    'remove-task-assignee': { inherits: 'is-colony-founder-or-admin' },
  };
}
