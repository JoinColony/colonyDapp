/* @flow */

import { connect } from 'react-redux';

import InboxContent from './InboxContent.jsx';

import { currentUserActivitiesSelector } from '../../../selectors';

export default connect((state: Object) => ({
  activities: currentUserActivitiesSelector(state),
}))(InboxContent);
