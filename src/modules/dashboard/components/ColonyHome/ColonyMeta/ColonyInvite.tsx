import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ClipboardCopy from '~core/ClipboardCopy';

import styles from './ColonyInvite.css';

const MSG = defineMessages({
  inviteLabel: {
    id: 'dashboard.ColonyHome.ColonyMeta.inviteLabel',
    defaultMessage: 'Invite your community to join',
  },
  copyLabel: {
    id: 'ClipboardCopy.copyLabel',
    defaultMessage: `{valueIsCopied, select,
      true {copied}
      false {copy}
    }`,
  },
});

interface Props {
  colonyName: string;
}

const displayName = 'dashboard.ColonyHome.ColonyInvite';

const ColonyInvite = ({ colonyName }: Props) => {
  if (!colonyName) {
    return null;
  }
  const colonyLink = `colony.io/colony/${colonyName}`;
  return (
    <section className={styles.main}>
      <FormattedMessage {...MSG.inviteLabel} tagName="p" />
      <p className={styles.linkDisplay}>
        <span>{colonyLink}</span>
        <ClipboardCopy text={MSG.copyLabel} value={`https://${colonyLink}`} />
      </p>
    </section>
  );
};

ColonyInvite.displayName = displayName;

export default ColonyInvite;
