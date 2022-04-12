import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Toggle } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './ManageWhitelistDialogForm.css';

const displayName = `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle`;

const MSG = defineMessages({
  toggleLabel: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle.toggleLabel`,
    defaultMessage: `{isWhitelistActivated, select,
      true {Active}
      other {Inactive}
    }`,
  },
  headerTitle: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle.headerTitle`,
    defaultMessage: 'Whitelisted addresses',
  },
  tooltipText: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle.tooltipText`,
    defaultMessage: `Whitelist is active by default once at least one address is added to the list. You can turn this feature “Off” to deactivate the whitelist. Use with caution.`,
  },
  warningText: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle.warningText`,
    defaultMessage: `<span>Warning.</span> You have deactivated the whitelist. You acknowledge potential risks and consequences by clicking ‘Confirm’. `,
  },
});

interface Props {
  isWhitelistActivated: boolean;
}

const ManageWhitelistActiveToggle = ({ isWhitelistActivated }: Props) => (
  <>
    <div className={styles.toggleContainer}>
      <Heading
        appearance={{ size: 'normal', margin: 'none', theme: 'dark' }}
        text={MSG.headerTitle}
      />
      <Toggle
        label={MSG.toggleLabel}
        labelValues={{ isWhitelistActivated }}
        name="isWhitelistActivated"
        tooltipText={MSG.tooltipText}
        tooltipClassName={styles.tooltip}
      />
    </div>
    {!isWhitelistActivated && (
      <div className={styles.warningContainer}>
        <p className={styles.warningText}>
          <FormattedMessage
            {...MSG.warningText}
            values={{
              span: (chunks) => (
                <span className={styles.warningLabel}>{chunks}</span>
              ),
            }}
          />
        </p>
      </div>
    )}
  </>
);

export default ManageWhitelistActiveToggle;

ManageWhitelistActiveToggle.displayName = displayName;
