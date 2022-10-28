import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~core/DropdownMenu';
import ExternalLink from '~core/ExternalLink';
import { FEEDBACK, HELP } from '~externalUrls';

import styles from './HelperSection.css';

const MSG = defineMessages({
  reportBugs: {
    id: 'users.PopoverSection.HelperSection.reportBugs',
    defaultMessage: 'Report Bugs',
  },
  helpCenter: {
    id: 'users.PopoverSection.HelperSection.helpCenter',
    defaultMessage: 'Help Center',
  },
});

const displayName = 'users.PopoverSection.HelperSection';

const HelperSection = () => (
  <DropdownMenuSection separator>
    <DropdownMenuItem>
      <ExternalLink
        href={FEEDBACK}
        text={MSG.reportBugs}
        className={styles.externalLink}
      />
    </DropdownMenuItem>
    <DropdownMenuItem>
      <ExternalLink
        href={HELP}
        text={MSG.helpCenter}
        className={styles.externalLink}
      />
    </DropdownMenuItem>
  </DropdownMenuSection>
);

HelperSection.displayName = displayName;

export default HelperSection;
