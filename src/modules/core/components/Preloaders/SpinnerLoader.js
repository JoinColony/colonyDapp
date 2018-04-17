/* @flow */

import compose from 'recompose/compose';
import { injectIntl } from 'react-intl';

import SpinnerLoader from './SpinnerLoader.jsx';

export default compose(injectIntl)(SpinnerLoader);
