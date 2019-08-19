/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { IntegrationType } from '~immutable';

import Card from '~core/Card';
import Icon from '~core/Icon';
import Heading from '~core/Heading';
import { ActionButton } from '~core/Button';

import styles from './IntegrationCard.css';

type Props = {|
  integration: IntegrationType,
|};

const displayName = 'admin.Tokens.IntegrationCard';

const MSG = defineMessages({
  github: {
    id: 'admin.IntegrationCard.github',
    defaultMessage: 'Github',
  },
  install: {
    id: 'admin.IntegrationCard.install',
    defaultMessage: 'Install',
  },
  settings: {
    id: 'admin.IntegrationCard.settings',
    defaultMessage: 'Settings',
  },
  cardText: {
    id: 'admin.IntegrationCard.cardText',
    defaultMessage: `Connect your github repos to sync your issues and tasks.`,
  },
});

const IntegrationCard = ({ integration: { name, installed } }: Props) => (
  <Card key={name} className={styles.main}>
    <div className={styles.cardHeading}>
      <Icon title="github" name="github" size="xs" />
      <Heading
        text={MSG.github}
        appearance={{
          size: 'normal',
          weight: 'medium',
          theme: 'dark',
        }}
      />
    </div>
    <div className={styles.cardBody}>
      <FormattedMessage {...MSG.cardText} />
    </div>
    <div className={styles.cardFooter}>
      {!installed ? (
        <ActionButton
          error="ACTIONS.INSTALL_INTEGRATION_ERROR"
          submit="ACTIONS.INSTALL_INTEGRATION"
          success="ACTIONS.INSTALL_INTEGRATION_SUCCESS"
          appearance={{ theme: 'blue' }}
          text={MSG.install}
        />
      ) : (
        <ActionButton
          error="ACTIONS.EDIT_INTEGRATION_ERROR"
          submit="ACTIONS.EDIT_INTEGRATION"
          success="ACTIONS.EDIT_INTEGRATION_SUCCESS"
          appearance={{ theme: 'blue' }}
          text={MSG.settings}
        />
      )}
    </div>
  </Card>
);

IntegrationCard.displayName = displayName;

export default IntegrationCard;
