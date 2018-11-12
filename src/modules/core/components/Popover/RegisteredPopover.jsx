/* @flow */

import React from 'react';
import { Set as ImmutableSet } from 'immutable';

import type { Props as PopoverProps } from './Popover.jsx';

import Popover from './Popover.jsx';
import withPopoverControls from './withPopoverControls';

type Props = PopoverProps & {
  /** Name of the registered popover */
  name: string,
  /** @ignore Will be injected by withPopoverControls */
  registeredPopovers: ImmutableSet<string>,
};

const RegisteredPopover = ({ name, registeredPopovers, ...props }: Props) => (
  <Popover isOpen={registeredPopovers.has(name)} {...props} />
);

export default withPopoverControls()(RegisteredPopover);
