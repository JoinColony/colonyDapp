import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js'

const MSG = defineMessages({
  rootLabel: {
    id: 'core.Permission.rootLabel',
    defaultMessage: 'Root',
  },
  administrationLabel: {
    id: 'core.Permission.administrationLabel',
    defaultMessage: 'Administration',
  },
  architectureLabel: {
    id: 'core.Permission.architectureLabel',
    defaultMessage: 'Architecture',
  },
  fundingLabel: {
    id: 'core.Permission.fundingLabel',
    defaultMessage: 'Funding',
  },
  arbitrationLabel: {
    id: 'core.Permission.arbitrationLabel',
    defaultMessage: 'Arbitration',
  },
  recoveryLabel: {
    id: 'core.Permission.recoveryLabel',
    defaultMessage: 'Recovery',
  },
});

export const permissionsObject = {
  [ColonyRole.Root]: {
    label: MSG.rootLabel,
    icon: 'emoji-gold-coin',
  },
  [ColonyRole.Administration]: {
    label: MSG.administrationLabel,
    icon: 'emoji-building',
  },
  [ColonyRole.Architecture]: {
    label: MSG.architectureLabel,
    icon: 'emoji-crane',
  },
  [ColonyRole.Funding]: {
    label: MSG.fundingLabel,
    icon: 'emoji-bag-money-sign',
  },
  [ColonyRole.Arbitration]: {
    label: MSG.arbitrationLabel,
    icon: 'emoji-judge',
  },
  [ColonyRole.Recovery]: {
    label: MSG.recoveryLabel,
    icon: 'emoji-alarm-lamp',
  },
};
