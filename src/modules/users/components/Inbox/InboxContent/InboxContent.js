/* @flow */

import { connect } from 'react-redux';

import InboxContent from './InboxContent.jsx';

import { inboxItemsSelector } from '../../../selectors';

export default connect((state: Object) => ({
  activities: inboxItemsSelector(state),
}))(InboxContent);
