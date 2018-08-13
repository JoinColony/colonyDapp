/* @flow */

import React, { Component } from 'react';
import type { Node } from 'react';

import type { Cancel, Close } from '../Dialog/types';

import Modal from '../Modal';
import Icon from '../Icon';

import modalStyles from '../Modal/Modal.css';

import styles from './ToasterBar.css';

type Props = {
  cancel: Cancel,
  close: Close,
  children: Node,
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
    const { requiresInteraction } = this.state;
    const { close, cancel, children, ...passProps } = this.props;

    const overlayClassName = {
      base: requiresInteraction ? modalStyles.overlay : modalStyles.overlayNone,
      afterOpen: modalStyles.overlayAfterOpen,
      beforeClose: modalStyles.overlayBeforeClose,
    };

    // console.log('overlayClassName', overlayClassName);

    const childProps = {
      ...passProps,
      requiresInteraction,
      cancel,
      close,
      setRequiresInteraction: this._setRequiresInteraction,
    };

    return (
      <Modal
        {...passProps}
        role="dialog"
        className={styles.modal}
        overlayClassName={overlayClassName}
        onRequestClose={this.attemptDismiss}
        cancel={this.attemptDismiss}
        shouldCloseOnEsc={!requiresInteraction}
        shouldCloseOnOverlayClick={false}
        isOpen
      >
        <div className={styles.main}>
          <div className={styles.content}>
            {children(childProps)}
            {/* {React.Children.only(children, childProps)} */}
          </div>
          <div className={styles.control}>
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
      </Modal>
    );
  }
}

export default ToasterBar;
