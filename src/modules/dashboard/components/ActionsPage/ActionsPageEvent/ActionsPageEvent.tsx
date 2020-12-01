import React from 'react';
import { defineMessages } from 'react-intl';
import { ParsedEvent, UserProfile } from '~data/index';
import { Address } from '~types/index';

const MSG = defineMessages({

});

const displayName = 'dashboard.ActionsPage.ActionsPageEvent';

interface Props {
  event: ParsedEvent;
  userProfile?: UserProfile;
}

const ActionsPageEvent = ({ event }: Props) => {
  return (
    <div></div>
  )
};

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
