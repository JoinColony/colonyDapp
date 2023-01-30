import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import Button from '~core/Button';

import { DropdownMenuItem, DropdownMenuSection } from '~core/DropdownMenu';
import ExternalLink from '~core/ExternalLink';
import { BEAMER_BUGS, BEAMER_NEWS, HELP } from '~externalUrls';
import { getBeamerId } from '~lib/beamer';

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

const HelperSection = () => {
  const handleWhatsNew = useCallback(() => {
    if (getBeamerId) {
      // Ignored undefined third party script, this should be implemented better in future
      // @ts-ignore
      // eslint-disable-next-line no-undef
      Beamer.show();
    } else {
      window.open(BEAMER_NEWS, '_blank');
    }
  }, []);

  const handleReportBugs = useCallback(() => {
    if (getBeamerId) {
      // Ignored undefined third party script, this should be implemented better in future
      // @ts-ignore
      // eslint-disable-next-line no-undef
      Beamer.show();
    } else {
      window.open(BEAMER_BUGS, '_blank');
    }
  }, []);

  return (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <Button
          appearance={{ theme: 'no-style' }}
          text={MSG.whatsNew}
          onClick={handleWhatsNew}
        />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Button
          appearance={{ theme: 'no-style' }}
          text={MSG.reportBugs}
          onClick={handleReportBugs}
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
};

HelperSection.displayName = displayName;

export default HelperSection;
