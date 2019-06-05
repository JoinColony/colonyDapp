/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import InboxIcon from './InboxIcon.jsx';

import { inboxItemsSelector } from '../../../selectors';

const enhanced = compose(
  connect((state: Object) => ({
    activities: inboxItemsSelector(state),
  })),
  withProps(({ activities }) => ({
    hasUnreadActivities:
      activities && activities.some(activity => activity.unread),
  })),
);

export default enhanced(InboxIcon);
