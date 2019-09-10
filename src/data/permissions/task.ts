import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';

import { EventTypes } from '~data/constants';
import { TaskEvents } from '~data/types/TaskEvents';
import { Address, ColonyClient, PermissionsManifest } from '~types/index';
import { ROOT_DOMAIN } from '../../modules/core/constants';
import { makeUserHasRoleFn } from './utils';

export default function loadModule(
  colonyClient: ColonyClient,
): PermissionsManifest<{
  domainId?: number;
  colonyAddress?: Address;
  event?: TaskEvents;
  heads?: object[];
}> {
  const isAdmin = makeUserHasRoleFn(colonyClient, COLONY_ROLE_ADMINISTRATION);
  const isFounder = makeUserHasRoleFn(colonyClient, COLONY_ROLE_ROOT);

  const isAdminOrFounder = async (
    userAddress: Address,
    domainId: number,
  ): Promise<boolean> => {
    const hasAdminRole = await isAdmin(userAddress, domainId);
    if (hasAdminRole) return hasAdminRole;

    return isFounder(userAddress, ROOT_DOMAIN);
  };

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
    'cancel-task': { inherits: 'is-founder-or-admin' },
    'create-task': { inherits: 'is-founder-or-admin' },
    'finalize-task': { inherits: 'is-founder-or-admin' },
    'remove-task-assignee': { inherits: 'is-founder-or-admin' },
    'send-task-work-invite': { inherits: 'is-founder-or-admin' },
    'send-task-work-request': async () => true,
    'set-task-assignee': { inherits: 'is-founder-or-admin' },
    'set-task-domain': async (userAddress, { event }) => {
      // Ideally, this would also check the current domainId; this has to
      // be done outside of the action controller, because Orbit only passes
      // the current entry to the `canAppend` method.
      return event && event.type === EventTypes.DOMAIN_SET
        ? isAdminOrFounder(userAddress, event.payload.domainId)
        : false;
    },
    'set-task-due-date': { inherits: 'is-founder-or-admin' },
    'set-task-payout': { inherits: 'is-founder-or-admin' },
    'set-task-skill': { inherits: 'is-founder-or-admin' },
    'update-task': { inherits: 'is-founder-or-admin' },
  };
}
