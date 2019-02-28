/* @flow */

import type { PermissionsManifest } from './types';

export default function loadModule(): PermissionsManifest {
  return {
    AVATAR_UPLOADED: { inherits: 'set-colony-avatar' },
    AVATAR_REMOVED: { inherits: 'set-colony-avatar' },
    DOMAIN_CREATED: { inherits: 'add-domain' },
    PROFILE_CREATED: { inherits: 'create-colony-profile' },
    PROFILE_UPDATED: { inherits: 'update-colony-profile' },
    TASK_STORE_REGISTERED: { inherits: 'register-task-store' },
    TASK_STORE_UNREGISTERED: { inherits: 'register-task-store' },
    TOKEN_INFO_ADDED: { inherits: 'add-token' },
    'create-colony-profile': { inherits: 'is-colony-founder' },
    'update-colony-profile': { inherits: 'is-colony-founder-or-admin' },
    'register-task-store': { inherits: 'is-colony-founder-or-admin' },
    'add-token': { inherits: 'is-colony-founder' },
    'set-colony-avatar': { inherits: 'is-colony-founder-or-admin' },
    'add-domain': { inherits: 'is-colony-founder-or-admin' },
  };
}
