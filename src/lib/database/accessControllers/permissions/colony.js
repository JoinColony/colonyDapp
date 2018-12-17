/* @flow */

import type { PermissionsManifest } from './types';

export default function loadModule(): PermissionsManifest {
  return {
    'set-colony-avatar': { inherits: 'is-colony-founder' },
    'add-global-skill': { inherits: 'is-colony-founder' },
    'set-admin-role': { inherits: 'is-colony-founder-or-admin' },
    'add-domain': { inherits: 'is-colony-founder-or-admin' },
  };
}
