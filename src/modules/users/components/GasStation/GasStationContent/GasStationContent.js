/* @flow */

import { connect } from 'react-redux';

import GasStationContent from './GasStationContent.jsx';

import { getCurrentUserBalance as getCurrentUserBalanceAction } from '../../../actionCreators';

export default connect(
  null,
  {
    getCurrentUserBalance: getCurrentUserBalanceAction,
  },
)(GasStationContent);
