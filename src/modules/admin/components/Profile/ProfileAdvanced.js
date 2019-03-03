/* @flow */

import compose from 'recompose/compose';

import withDialog from '~core/Dialog/withDialog';

import ProfileAdvanced from './ProfileAdvanced.jsx';

const enhance = compose(withDialog());

export default enhance(ProfileAdvanced);
