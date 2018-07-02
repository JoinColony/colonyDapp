/* @flow */

import type { IntlShape, MessageDescriptor } from 'react-intl';

import { Component } from 'react';

// import { getMainClasses } from '~utils/css';

type Props = {
  /** `react-intl` object, so that we have access to the `formatMessage()` method */
  intl: IntlShape,
  /** The label text for this field component */
  label?: MessageDescriptor | string,
  /** The placeholder for this field component */
  placeholder?: MessageDescriptor | string,
  /** The title for this field component (html title attribute) */
  title?: MessageDescriptor | string,
};

class Field extends Component<Props> {
  getIntlFormatted = (
    prop?: MessageDescriptor | string,
    values?: { [string]: string },
  ): string => {
    const {
      intl: { formatMessage },
    } = this.props;
    if (!prop) {
      return '';
    }
    if (typeof prop == 'string') {
      return prop;
    }
    return formatMessage(prop, values);
  };

  getLabel = (): string => {
    const { label } = this.props;
    return this.getIntlFormatted(label);
  };

  getTitle = (): string => {
    const { label, placeholder, title } = this.props;
    return (
      this.getIntlFormatted(title) ||
      this.getIntlFormatted(label) ||
      this.getIntlFormatted(placeholder)
    );
  };
}

export default Field;
