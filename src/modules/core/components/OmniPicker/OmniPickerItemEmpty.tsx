import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './OmniPickerItemEmpty.css';

const MSG = defineMessages({
  emptyMessage: {
    id: 'OmniPicker.OmniPickerItemEmpty.emptyMessage',
    defaultMessage: "It looks like I couldn't find what you're looking for",
  },
});

const EmptyComponent = () => (
  <span className={styles.main}>
    <FormattedMessage {...MSG.emptyMessage} />
  </span>
);

export default EmptyComponent;
