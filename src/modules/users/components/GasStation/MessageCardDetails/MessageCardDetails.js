/* @flow */

import { connect } from 'react-redux';

import { messageCancel } from '../../../../core/actionCreators';
import MessageCardDetails from './MessageCardDetails.jsx';

export default connect(
  null,
  {
    cancelMessage: messageCancel,
  },
)(MessageCardDetails);
