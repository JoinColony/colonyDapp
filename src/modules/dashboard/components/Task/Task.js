/* @flow */

import { compose } from 'recompose';

import withDialog from '~core/Dialog/withDialog';

import Task from './Task.jsx';

const enhance = compose(withDialog());

export default enhance(Task);
