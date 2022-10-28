import React from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~core/Button';
import { DropdownMenuItem, DropdownMenuSection } from '~core/DropdownMenu';
import { ActionTypes } from '~redux/actionTypes';

const MSG = defineMessages({
  signOut: {
    id: 'users.PopoverSection.MetaSection.link.signOut',
    defaultMessage: 'Sign Out',
  },
});

const displayName = 'users.PopoverSection.MetaSection';

const MetaSection = () => (
  <DropdownMenuSection separator>
    <DropdownMenuItem>
      <ActionButton
        appearance={{ theme: 'no-style' }}
        text={MSG.signOut}
        submit={ActionTypes.USER_LOGOUT}
        error={ActionTypes.USER_LOGOUT_ERROR}
        success={ActionTypes.USER_LOGOUT_SUCCESS}
      />
    </DropdownMenuItem>
  </DropdownMenuSection>
);

MetaSection.displayName = displayName;

export default MetaSection;
