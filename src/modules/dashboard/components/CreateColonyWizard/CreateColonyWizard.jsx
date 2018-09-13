/* @flow */
import withProps from 'recompose/withProps';
import compose from 'recompose/compose';

import Template from '../../../pages/WizardTemplate';

const enhance = compose(withProps({ external: true })(Template));

export default enhance;
