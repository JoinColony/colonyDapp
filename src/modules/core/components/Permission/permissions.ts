import { defineMessages } from 'react-intl';

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
  root: {
    label: MSG.rootLabel,
    icon: 'emoji-gold-coin',
  },
  administration: {
    label: MSG.administrationLabel,
    icon: 'emoji-building',
  },
  architecture: {
    label: MSG.architectureLabel,
    icon: 'emoji-crane',
  },
  funding: {
    label: MSG.fundingLabel,
    icon: 'emoji-bag-money-sign',
  },
  arbitration: {
    label: MSG.arbitrationLabel,
    icon: 'emoji-judge',
  },
  recovery: {
    label: MSG.recoveryLabel,
    icon: 'emoji-alarm-lamp',
  },
};
