import { ColonyEvents } from '~data/types/ColonyEvents';
import { Address, PermissionsManifest } from '~types/index';

export default function loadModule(): PermissionsManifest<{
  colonyAddress: Address;
  event: ColonyEvents;
}> {
  return {
    // @TODO Provide a proper mapping from event types to action permission
    COLONY_AVATAR_REMOVED: { inherits: 'set-colony-avatar' },
    COLONY_AVATAR_UPLOADED: { inherits: 'set-colony-avatar' },
    COLONY_PROFILE_CREATED: { inherits: 'create-colony-profile' },
    COLONY_PROFILE_UPDATED: { inherits: 'update-colony-profile' },
    DOMAIN_CREATED: { inherits: 'add-domain' },
    DOMAIN_EDITED: { inherits: 'edit-domain' },
    TASK_INDEX_STORE_REGISTERED: { inherits: 'register-task-store' },
    TASK_STORE_REGISTERED: { inherits: 'register-task-store' },
    TASK_STORE_UNREGISTERED: { inherits: 'register-task-store' },
    TOKEN_INFO_ADDED: { inherits: 'add-token' },
    TOKEN_INFO_REMOVED: { inherits: 'add-token' },
    'add-domain': { inherits: 'is-founder-or-admin' },
    'edit-domain': { inherits: 'is-founder-or-admin' },
    'add-token': { inherits: 'is-founder' },
    'create-colony-profile': { inherits: 'is-founder' },
    'register-task-store': { inherits: 'is-founder-or-admin' },
    'set-colony-avatar': { inherits: 'is-founder-or-admin' },
    'update-colony-profile': { inherits: 'is-founder-or-admin' },
  };
}
