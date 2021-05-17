import { defineMessages } from 'react-intl';

export const ExtensionsMSG = defineMessages({
  headingDefaultUninstall: {
    id: 'dashboard.Extensions.ExtensionDetails.headingDefaultUninstall',
    defaultMessage: 'Uninstall extension',
  },
  textDefaultUninstall: {
    id: 'dashboard.Extensions.ExtensionDetails.textDefaultUninstall',
    defaultMessage: `This extension is currently deprecated, and may be uninstalled. Doing so will remove it from the colony and any processes requiring it will no longer work.`,
  },
  headingVotingUninstall: {
    id: 'dashboard.Extensions.ExtensionDetails.headingVotingUninstall',
    defaultMessage: 'WARNING',
  },
  textVotingUninstall: {
    id: 'dashboard.Extensions.ExtensionDetails.textVotingUninstall',
    defaultMessage: `Please ensure that all funds in processes associated with this extension are claimed by their owners before uninstalling. Not doing so will result in permanent loss of the unclaimed funds.`,
  },
  typeInBox: {
    id: 'dashboard.Extensions.ExtensionDetails.typeInBox',
    defaultMessage: `Type "I UNDERSTAND" in the box below to proceed.`,
  },
  warningPlaceholder: {
    id: 'dashboard.Extensions.ExtensionDetails.warningPlaceholder',
    defaultMessage: `I UNDERSTAND`,
  }
});
