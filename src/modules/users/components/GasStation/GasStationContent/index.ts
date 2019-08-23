import { connect } from 'react-redux';

// @ts-ignore
import GasStationContent from './GasStationContent.tsx';
import { currentUserGetBalance } from '../../../actionCreators';

export * from './GasStationContent';

export default connect(
  null,
  { currentUserGetBalance },
)(GasStationContent) as any;
