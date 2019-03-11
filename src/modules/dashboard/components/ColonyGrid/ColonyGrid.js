/* @flow */

import { compose } from 'recompose';

import { withImmutablePropsToJS } from '~utils/hoc';

import { withColonies } from '../../hocs';
import ColonyGrid from './ColonyGrid.jsx';

export default compose(
  withColonies,
  withImmutablePropsToJS,
)(ColonyGrid);
