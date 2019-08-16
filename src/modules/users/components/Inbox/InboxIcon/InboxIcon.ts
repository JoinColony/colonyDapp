import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import { RootStateRecord } from '~immutable/state';
// @ts-ignore
import InboxIcon from './InboxIcon.tsx';
import { inboxItemsSelector } from '../../../selectors';

const enhanced = compose(
  connect((state: RootStateRecord) => ({
    activities: inboxItemsSelector(state),
  })),
  withProps(({ activities }) => ({
    hasUnreadActivities:
      activities && activities.some(activity => activity.unread),
  })),
);

export default enhanced(InboxIcon);
