import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~core/DropdownMenu';
import NavLink from '~core/NavLink';
import { CREATE_COLONY_ROUTE } from '~routes/routeConstants';

const MSG = defineMessages({
  createColony: {
    id: 'users.PopoverSection.ColonySection.link.createColony',
    defaultMessage: 'Create a Colony',
  },
});

const displayName = 'users.PopoverSection.ColonySection';

const ColonySection = () => (
  <DropdownMenuSection separator>
    <DropdownMenuItem>
      <NavLink to={CREATE_COLONY_ROUTE} text={MSG.createColony} />
    </DropdownMenuItem>
  </DropdownMenuSection>
);

ColonySection.displayName = displayName;

export default ColonySection;
