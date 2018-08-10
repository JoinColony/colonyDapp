/* @flow */

import React, { Component } from 'react';

import Dialog from './Dialog.jsx';
import Button from '../Button';
import Icon from '../Icon';

import modalStyles from '../Modal/Modal.css';

import styles from './ToasterBar.css';

type Props = {
  cancel: () => void,
  // close: (val: any) => void,
  // children: Node,
  renderContent: (val: any) => Node,
  // heading?: string | MessageDescriptor,
  // text?: string | MessageDescriptor,
  // cancelButtonText?: string | MessageDescriptor,
  // confirmButtonText?: string | MessageDescriptor,
  // requiresInteraction: boolean,
  // setRequiresInteraction?: (val: any) => boolean,
};

type State = {
  requiresInteraction: boolean,
};

class ToasterBar extends Component<Props, State> {
  static defaultProps = {};

  state = {
    requiresInteraction: false,
  };

  _setRequiresInteraction = bool => {
    this.setState({
      requiresInteraction: bool,
    });
  };

  attemptDismiss = (...params) => {
    const { requiresInteraction } = this.state;
    const { cancel } = this.props;
    return !requiresInteraction && cancel(...params);
  };

  render() {
    const { renderContent } = this.props;
    const { requiresInteraction } = this.state;

    const overlayClassName = {
      base: requiresInteraction ? modalStyles.overlay : modalStyles.overlayNone,
      afterOpen: modalStyles.overlayAfterOpen,
      beforeClose: modalStyles.overlayBeforeClose,
    };

    return (
      <Dialog
        overlayClassName={overlayClassName}
        shouldCloseOnEsc={!requiresInteraction}
        shouldCloseOnOverlayClick={false}
        cancel={this.attemptDismiss}
      >
        <div className={styles.main}>
          <div className={styles.content}>
            {renderContent({
              ...this.props,
              setRequiresInteraction: this._setRequiresInteraction,
              requiresInteraction,
            })}
          </div>
          <div className={styles.barControl}>
            {requiresInteraction || (
              <Icon
                role="button"
                name="circle-close"
                title="close"
                onClick={this.attemptDismiss}
                appearance={{ size: 'large', theme: 'invert' }}
              />
            )}
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ToasterBar;
