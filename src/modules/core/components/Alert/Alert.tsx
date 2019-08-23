import React, { ReactNode, Component } from 'react';
import {
  IntlShape,
  MessageDescriptor,
  MessageValues,
  injectIntl,
} from 'react-intl';

import { getMainClasses } from '~utils/css';
import Icon from '~core/Icon';
import styles from './Alert.css';

interface Appearance {
  theme?: 'primary' | 'info' | 'danger';
  size?: 'small';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** `children` to render (only works if `text` is not set) */
  children?: ReactNode;

  /** A string or a `messageDescriptor` that make up the alert's content */
  text?: MessageDescriptor | string;

  /** Values for loading text (react-intl interpolation) */
  textValues?: MessageValues;

  /** @ignore Injected by `injectIntl` */
  intl: IntlShape;

  /** Should the alert be dismissible */
  isDismissible?: boolean;

  /** Callback after alert is dismissed (only if `isDismissible` is `true`) */
  onAlertDismissed?: () => void;
}

interface State {
  isOpen: boolean;
}

class Alert extends Component<Props, State> {
  static defaultProps = {
    appearance: {
      theme: 'danger',
    },
    isDismissible: false,
  };

  static displayName = 'Alert';

  state = {
    isOpen: true,
  };

  handleDismiss = () => {
    const { isDismissible, onAlertDismissed: callback } = this.props;
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
      appearance,
      children,
      intl: { formatMessage },
      isDismissible,
      text,
      textValues,
    } = this.props;
    const { isOpen } = this.state;

    if (!isOpen) return null;

    const alertText =
      typeof text === 'string' ? text : text && formatMessage(text, textValues);
    return (
      <div className={getMainClasses(appearance, styles)}>
        {isDismissible && (
          <button
            className={styles.closeButton}
            type="button"
            onClick={this.handleDismiss}
          >
            <Icon
              appearance={{ size: 'small' }}
              name="close"
              title={{ id: 'button.close' }}
            />
          </button>
        )}
        {alertText || children}
      </div>
    );
  }
}

export default injectIntl(Alert);
