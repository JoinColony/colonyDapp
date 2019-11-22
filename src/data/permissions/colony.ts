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
    // @todo Fix domain permissions
    // @body For now that's OK because we only allow 1 level depth of domains. As soon as that changes, we have to find a solution for this
    'add-domain': { inherits: 'has-root-architecture' },
    'edit-domain': { inherits: 'has-root-architecture' },
    'add-token': { inherits: 'is-root' },
    'create-colony-profile': { inherits: 'is-root' },
    'register-task-store': { inherits: 'is-admin' },
    'set-colony-avatar': { inherits: 'is-root' },
    'update-colony-profile': { inherits: 'is-root' },
  };
}
