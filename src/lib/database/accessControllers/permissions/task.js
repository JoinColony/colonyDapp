/* @flow */

import type { PermissionsManifest } from './types';

export default function loadModule(): PermissionsManifest {
  return {
    'create-task': { inherits: 'is-colony-founder-or-admin' },
    'cancel-task': { inherits: 'is-task-manager-or-evaluator' },
    'set-task-skill': { inherits: 'is-task-manager-or-evaluator' },
    'set-task-domain': { inherits: 'is-task-manager-or-evaluator' },
    'set-task-due-date': { inherits: 'is-task-manager-or-evaluator' },
    'set-task-worker': { inherits: 'is-task-manager-or-evaluator' },
    'change-task-title-or-brief': { inherits: 'is-task-manager-or-evaluator' },
    'send-task-work-request': async () => true,
    'send-task-work-invite': { inherits: 'is-task-manager-or-evaluator' },
    'close-task': { inherits: 'is-task-manager-or-evaluator' },
    'set-task-manager-payout': { inherits: 'is-task-manager' },
    'set-task-evaluator-payout': { inherits: 'is-task-manager-or-evaluator' },
    'set-task-worker-payout': { inherits: 'is-task-manager-or-worker' },
    'remove-task-evaluator-role': { inherits: 'is-task-manager-or-evaluator' },
    'remove-task-worker-role': { inherits: 'is-task-manager-or-worker' },
    // @TODO: We might want make this validate signatures
    'set-task-worker-role': { inherits: 'is-task-manager-or-evaluator' },
  };
}
