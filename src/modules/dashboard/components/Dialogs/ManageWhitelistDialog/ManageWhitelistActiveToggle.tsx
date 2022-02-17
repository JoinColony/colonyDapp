import React from 'react';
import { defineMessages } from 'react-intl';

import { Toggle } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './ManageWhitelistDialogForm.css';

const displayName = `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle`;

const MSG = defineMessages({
  toggleLabel: {
    id: `dashboard.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle.toggleLabel`,
    defaultMessage: `{whitelistStatusValue, select,
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
});

interface Props {
  whitelistStatusValue: boolean;
}

const ManageWhitelistActiveToggle = ({ whitelistStatusValue }: Props) => (
  <div className={styles.toggleContainer}>
    <Heading
      appearance={{ size: 'normal', margin: 'none', theme: 'dark' }}
      text={MSG.headerTitle}
    />
    <Toggle
      label={MSG.toggleLabel}
      labelValues={{ whitelistStatusValue }}
      name="whitelistStatus"
      tooltipText={MSG.tooltipText}
      tooltipClassName={styles.tooltip}
    />
  </div>
);

export default ManageWhitelistActiveToggle;

ManageWhitelistActiveToggle.displayName = displayName;
