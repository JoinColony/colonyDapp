import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ColorTag, { Color } from '~core/ColorTag';
import { Colony } from '~data/index';

import styles from './NewTeam.css';

export const MSG = defineMessages({
  none: {
    id: 'dashboard.EditExpenditureDialog.NewTeam.none',
    defaultMessage: 'None',
  },
});

interface Props {
  team: string;
  colony: Colony;
}

const NewTeam = ({ team, colony }: Props) => {
  if (!team) {
    return (
      <div className={styles.row}>
        <FormattedMessage {...MSG.none} />
      </div>
    );
  }

  const domain = colony?.domains.find(
    ({ ethDomainId }) => Number(team) === ethDomainId,
  );
  const defaultColor =
    team === String(ROOT_DOMAIN_ID) ? Color.LightPink : Color.Yellow;

  const color = domain ? domain.color : defaultColor;
  return (
    <div className={styles.teamWrapper}>
      <ColorTag color={color} />
      <span>{domain?.name}</span>
    </div>
  );
};

export default NewTeam;
