import { defineMessages, MessageDescriptor } from 'react-intl';

import { ColonyRole } from '@colony/colony-js';

const MSG = defineMessages({
  rootLabel: {
    id: 'core.Permission.rootLabel',
    defaultMessage: 'Root',
  },
  rootInfoMessage: {
    id: 'core.Permission.rootInfoMessage',
    defaultMessage: 'Root permission',
  },
  administrationLabel: {
    id: 'core.Permission.administrationLabel',
    defaultMessage: 'Administration',
  },
  administrationInfoMessage: {
    id: 'core.Permission.administrationInfoMessage',
    defaultMessage: 'Administration permission',
  },
  architectureLabel: {
    id: 'core.Permission.architectureLabel',
    defaultMessage: 'Architecture',
  },
  architectureInfoMessage: {
    id: 'core.Permission.architectureInfoMessage',
    defaultMessage: 'Architecture permission',
  },
  fundingLabel: {
    id: 'core.Permission.fundingLabel',
    defaultMessage: 'Funding',
  },
  fundingInfoMessage: {
    id: 'core.Permission.fundingInfoMessage',
    defaultMessage: 'Funding permission',
  },
  arbitrationLabel: {
    id: 'core.Permission.arbitrationLabel',
    defaultMessage: 'Arbitration',
  },
  arbitrationInfoMessage: {
    id: 'core.Permission.arbitrationInfoMessage',
    defaultMessage: 'Arbitration permission',
  },
  recoveryLabel: {
    id: 'core.Permission.recoveryLabel',
    defaultMessage: 'Recovery',
  },
  recoveryInfoMessage: {
    id: 'core.Permission.recoveryInfoMessage',
    defaultMessage: 'Recovery permission',
  },
});

export type PermissionDefaults = {
  label: MessageDescriptor;
  infoMessage: MessageDescriptor;
  icon: string;
};
export type PermissionsObject = {
  [colonyRole: number]: PermissionDefaults;
};

export const permissionsObject: PermissionsObject = {
  [ColonyRole.Root]: {
    label: MSG.rootLabel,
    infoMessage: MSG.rootInfoMessage,
    icon: 'emoji-yellow-superman',
  },
  [ColonyRole.Administration]: {
    label: MSG.administrationLabel,
    infoMessage: MSG.administrationInfoMessage,
    icon: 'emoji-clipboard',
  },
  [ColonyRole.Architecture]: {
    label: MSG.architectureLabel,
    infoMessage: MSG.architectureInfoMessage,
    icon: 'emoji-crane',
  },
  [ColonyRole.Funding]: {
    label: MSG.fundingLabel,
    infoMessage: MSG.fundingInfoMessage,
    icon: 'emoji-bag-money-sign',
  },
  [ColonyRole.Arbitration]: {
    label: MSG.arbitrationLabel,
    infoMessage: MSG.arbitrationInfoMessage,
    icon: 'emoji-balance',
  },
  [ColonyRole.Recovery]: {
    label: MSG.recoveryLabel,
    infoMessage: MSG.recoveryInfoMessage,
    icon: 'emoji-alarm-lamp',
  },
};
