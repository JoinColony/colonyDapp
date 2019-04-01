/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import InboxIcon from './InboxIcon.jsx';

import { currentUserActivitiesSelector } from '../../../selectors';

const enhanced = compose(
  connect((state: Object) => ({
    activities: currentUserActivitiesSelector(state),
  })),
  /*
   * @TODO Introduce handled logic
   */
  // withProps(({ activities }) => ({
  //   hasUnreadActivities: !!(
  //     activities && activities.find(activity => !activity.handled)
  //   ),
  // })),
  withProps(({ activities }) => ({
    hasUnreadActivities: !!(activities && activities.size > 0),
  })),
);

export default enhanced(InboxIcon);
