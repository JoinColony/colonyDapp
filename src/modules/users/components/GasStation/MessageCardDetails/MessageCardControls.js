/* @flow */

import type { HOC } from 'recompose';

import { withImmutablePropsToJS } from '~utils/hoc';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import type { MessageProps } from '~immutable';

import { walletTypeSelector } from '../../../selectors';
import MessageCardControls from './MessageCardControls.jsx';

export type InProps = {|
  message: $ReadOnly<MessageProps>,
|};

const enhance: HOC<*, InProps> = compose(
  connect(state => ({
    walletType: walletTypeSelector(state),
  })),
  withProps(({ walletType }) => ({
    walletNeedsAction: walletType !== 'software' ? walletType : undefined,
  })),
  withImmutablePropsToJS,
);

export default enhance(MessageCardControls);
