/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import InboxIcon from './InboxIcon.jsx';

import { currentUserActivitiesSelector } from '../../../selectors';

const enhanced = compose(
  connect((state: Object) => ({
    activities: currentUserActivitiesSelector(state),
  })),
  withProps(({ activities }) => ({
    hasUnreadActivities: !!(
      activities && activities.find(activity => activity.unread)
    ),
  })),
);

export default enhanced(InboxIcon);
