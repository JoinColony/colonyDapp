/* @flow */

import { connect } from 'react-redux';

import GasStationContent from './GasStationContent.jsx';

import { currentUserGetBalance } from '../../../actionCreators';

export default connect(
  null,
  { currentUserGetBalance },
)(GasStationContent);
