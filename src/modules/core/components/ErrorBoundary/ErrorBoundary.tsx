import { Component, ReactNode } from 'react';
import {
  defineMessages,
  injectIntl,
  MessageDescriptor,
  IntlShape,
} from 'react-intl';

const MSG = defineMessages({
  somethingWentWrong: {
    id: 'ErrorBoundary.somethingWentWrong',
    defaultMessage: 'Something went wrong while rendering',
  },
});

interface Props {
  /*
   * Message to render when an error happens
   * (can be a string or a message descriptor)
   */
  message?: MessageDescriptor | string;

  /*
   * React-intl, so we can format message descriptors
   */
  intl: IntlShape;

  /*
   * Children to render if everything goes according to plan
   */
  children: ReactNode | string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  static displayName = 'ErrorBoundry';

  state = {
    hasError: false,
  };

  /*
   * This will catch any errors thrown, and will not block the render,
   * but it will log them to the console.
   *
   * This log is only available in the dev environment
   *
   * See more:
   * https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
   */
  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const {
      message = MSG.somethingWentWrong,
      intl: { formatMessage },
      children,
    } = this.props;
    if (hasError) {
      if (typeof message === 'object' && message.id) {
        return formatMessage(message);
      }
      if (typeof message === 'string') {
        return message;
      }
    }
    return children;
  }
}

export default injectIntl(ErrorBoundary);
