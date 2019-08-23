import React, { ReactNode, Component } from 'react';

import Icon from '~core/Icon';
import styles from './Card.css';

interface Props {
  /** Card child content to render */
  children: ReactNode;

  /** Optional additional class name for further styling */
  className?: string;

  /** Whether or not the card should be dismissable. If `true`, will add close icon in top right corner. */
  isDismissible?: boolean;

  /** Callback function called on card dismiss. (Only if `isDismissible` is set to `true`) */
  onCardDismissed?: () => void;
}

interface State {
  isOpen: boolean;
}

class Card extends Component<Props, State> {
  static defaultProps = {
    isDismissible: false,
  };

  static displayName = 'Card';

  state = {
    isOpen: true,
  };

  handleClose = () => {
    const { isDismissible, onCardDismissed: callback } = this.props;
    if (!isDismissible) return;
    this.setState(
      {
        isOpen: false,
      },
      () => {
        if (typeof callback === 'function') {
          callback();
        }
      },
    );
  };

  render() {
    const {
      children,
      className,
      isDismissible,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onCardDismissed,
      ...props
    } = this.props;
    const { isOpen } = this.state;

    if (!isOpen) return null;

    const mainClass = styles.main;
    const classNames = className ? `${mainClass} ${className}` : mainClass;
    return (
      <li className={classNames} {...props}>
        {isDismissible && (
          <button
            className={styles.closeButton}
            onClick={this.handleClose}
            type="button"
          >
            <Icon
              appearance={{ size: 'normal' }}
              name="close"
              title={{ id: 'button.close' }}
            />
          </button>
        )}
        {children}
      </li>
    );
  }
}

export default Card;
