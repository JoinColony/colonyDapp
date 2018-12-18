/* @flow */

import type { PermissionsManifest } from './types';

export default function loadModule(): PermissionsManifest {
  return {
    'cancel-task': { inherits: 'is-task-manager-or-worker' },
    'create-task': { inherits: 'is-colony-founder-or-admin' },
    'send-task-work-invite': { inherits: 'is-task-manager-or-evaluator' },
    'send-task-work-request': async () => true,
    'set-task-brief': { inherits: 'is-task-manager-or-worker' },
    'set-task-domain': { inherits: 'is-task-manager-or-worker' },
    'set-task-due-date': { inherits: 'is-task-manager-or-worker' },
    'set-task-skill': { inherits: 'is-task-manager-or-worker' },
    'set-task-evaluator-payout': { inherits: 'is-task-manager-or-evaluator' },
    'set-task-manager-payout': { inherits: 'is-task-manager' },
    'set-task-worker-payout': { inherits: 'is-task-manager-or-worker' },
    // @TODO: We might want make this validate signatures
    'set-task-worker-role': { inherits: 'is-task-manager' },
    'submit-task-deliverable': { inherits: 'is-task-worker' },
    'claim-task-payout': { inherits: 'is-assigned-to-task' },
    'submit-task-work-rating': { inherits: 'is-assigned-to-task' },
    'reveal-task-work-rating': { inherits: 'is-assigned-to-task' },
    'remove-task-evaluator-role': { inherits: 'is-task-manager-or-evaluator' },
    'remove-task-worker-role': { inherits: 'is-task-manager-or-worker' },
  };
}
