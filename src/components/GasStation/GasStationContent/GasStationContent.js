/* @flow */

import { connect } from 'react-redux';

import GasStationContent from './GasStationContent.jsx';

import { getCurrentUserBalance as getCurrentUserBalanceAction } from '~redux/actionCreators';

export default connect(
  null,
  {
    getCurrentUserBalance: getCurrentUserBalanceAction,
  },
)(GasStationContent);
