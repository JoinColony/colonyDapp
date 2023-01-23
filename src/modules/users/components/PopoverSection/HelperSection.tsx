import React from 'react';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';

import { DropdownMenuItem, DropdownMenuSection } from '~core/DropdownMenu';
import ExternalLink from '~core/ExternalLink';
import { HELP } from '~externalUrls';

import styles from './HelperSection.css';

const MSG = defineMessages({
  whatsNew: {
    id: 'users.PopoverSection.HelperSection.whatsNew',
    defaultMessage: `What's New`,
  },
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
      <Button
        appearance={{ theme: 'no-style' }}
        text={MSG.whatsNew}
        // Ignored undefined third party script, this should be implemented better in future
        // @ts-ignore
        // eslint-disable-next-line no-undef
        onClick={() => Beamer.show()}
      />
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Button
        appearance={{ theme: 'no-style' }}
        text={MSG.reportBugs}
        // Ignored undefined third party script, this should be implemented better in future
        // @ts-ignore
        // eslint-disable-next-line no-undef
        onClick={() => Beamer.show()}
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
