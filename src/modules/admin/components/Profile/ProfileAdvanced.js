/* @flow */

import { compose } from 'recompose';

import { withFeatureFlags } from '~utils/hoc';
import withDialog from '~core/Dialog/withDialog';

import ProfileAdvanced from './ProfileAdvanced.jsx';

const enhance = compose(
  withFeatureFlags(),
  withDialog(),
);

export default enhance(ProfileAdvanced);
