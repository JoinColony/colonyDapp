import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './FileUpload.css';

const MSG = defineMessages({
  dropzoneText: {
    id: 'FileUpload.DefaultPlaceholder.dropzoneText',
    defaultMessage: 'Drag or {browse}',
  },
  dropzoneTextBrowseAction: {
    id: 'FileUpload.DefaultPlaceholder.dropzoneTextBrowseAction',
    defaultMessage: 'browse',
  },
});

const displayName = 'FileUpload.DefaultPlaceholder';

interface Props {
  disabled?: boolean;
}

const DefaultPlaceholder = ({ disabled }: Props) => (
  <div
    className={
      disabled ? styles.placeholderTextDisabled : styles.placeholderText
    }
  >
    <FormattedMessage
      {...MSG.dropzoneText}
      values={{
        browse: (
          <span className={disabled ? '' : styles.browseButton}>
            <FormattedMessage {...MSG.dropzoneTextBrowseAction} />
          </span>
        ),
      }}
    />
  </div>
);

DefaultPlaceholder.displayName = displayName;

export default DefaultPlaceholder;
