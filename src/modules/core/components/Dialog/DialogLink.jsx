/* @flow */

import type { Node } from 'react';

import { Component } from 'react';

import type { OpenDialog } from './types';

import withDialog from './withDialog';

type Props = {
  /** Render prop for element opening the dialog. In 99,9% this will be a button! */
  children: ({ open: OpenDialog }) => Node,
  /** Props passed to the dialog */
  props?: { [string]: any },
  /** Name of the Dialog to open */
  to: string,
  /** @ignore Will be injected by withDialog */
  openDialog: OpenDialog,
};

class DialogLink extends Component<Props> {
  open = () => {
    const { openDialog, props, to } = this.props;
    return openDialog(to, props);
  };

  render() {
    const { children } = this.props;
    return children({ open: this.open });
  }
}

export default withDialog()(DialogLink);
