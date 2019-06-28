/* @flow */

import type { PermissionsManifest } from '~types';

export default function loadModule(): PermissionsManifest {
  return {
    // @TODO Provide a proper mapping from event types to action permission
    COLONY_AVATAR_REMOVED: { inherits: 'set-colony-avatar' },
    COLONY_AVATAR_UPLOADED: { inherits: 'set-colony-avatar' },
    COLONY_PROFILE_CREATED: { inherits: 'create-colony-profile' },
    COLONY_PROFILE_UPDATED: { inherits: 'update-colony-profile' },
    DOMAIN_CREATED: { inherits: 'add-domain' },
    TASK_INDEX_STORE_REGISTERED: { inherits: 'register-task-store' },
    TASK_STORE_REGISTERED: { inherits: 'register-task-store' },
    TASK_STORE_UNREGISTERED: { inherits: 'register-task-store' },
    TOKEN_INFO_ADDED: { inherits: 'add-token' },
    TOKEN_INFO_REMOVED: { inherits: 'add-token' },
    'add-domain': { inherits: 'is-colony-founder-or-admin' },
    'add-token': { inherits: 'is-colony-founder' },
    'create-colony-profile': { inherits: 'is-colony-founder' },
    'register-task-store': { inherits: 'is-colony-founder-or-admin' },
    'set-colony-avatar': { inherits: 'is-colony-founder-or-admin' },
    'update-colony-profile': { inherits: 'is-colony-founder-or-admin' },
  };
}
