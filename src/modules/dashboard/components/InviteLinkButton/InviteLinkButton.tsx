import React, { useState, useEffect, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import copyToClipboard from 'copy-to-clipboard';

import { Tooltip } from '~core/Popover';
import Button, { Appearance as ButtonAppearance } from '~core/Button';

import styles from './styles.css';

const MSG = defineMessages({
  buttonText: {
    id: 'dashboard.InviteLinkButton.buttonText',
    defaultMessage: 'Invite',
  },
  copyLinkTooltip: {
    id: 'dasboard.InviteLinkButton.copyLinkTooltip',
    defaultMessage: `{copied, select,
      true {Invitation link copied!}
      false {Click to copy your shareable colony URL}
    }`,
  },
});

interface Props {
  colonyName: string;
  buttonAppearance?: ButtonAppearance;
}

const displayName = 'dashboard.InviteLinkButton';

const InviteLinkButton = ({ colonyName, buttonAppearance }: Props) => {
  const [copied, setCopied] = useState(false);
  const colonyURL = `${window.location.origin}/colony/${colonyName}`;
  const handleClipboardCopy = useCallback(() => {
    setCopied(true);
    copyToClipboard(colonyURL);
  }, [colonyURL]);

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);
  return (
    <Tooltip
      content={
        <div className={styles.tooltip}>
          <FormattedMessage {...MSG.copyLinkTooltip} values={{ copied }} />
        </div>
      }
    >
      <div className={styles.inviteLinkButton}>
        <Button
          text={MSG.buttonText}
          appearance={buttonAppearance}
          onClick={handleClipboardCopy}
          onKeyPress={handleClipboardCopy}
        />
      </div>
    </Tooltip>
  );
};

InviteLinkButton.displayName = displayName;

export default InviteLinkButton;
