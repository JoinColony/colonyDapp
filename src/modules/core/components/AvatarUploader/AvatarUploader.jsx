/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import Dropzone from 'react-dropzone';

import styles from './AvatarUploader.css';

import type { FileReaderFile } from '../FileUpload';

import FileUpload from '../FileUpload';

import Button from '../Button';

import AvatarUploadItem from './AvatarUploadItem.jsx';

const MSG = defineMessages({
  dropNow: {
    id: 'AvatarUploader.dropNow',
    defaultMessage: 'Drop now!',
  },
  notAllowed: {
    id: 'AvatarUploader.notAllowed',
    defaultMessage: 'Not allowed',
  },
});

type Props = {
  /** Only render the Uploader, no label */
  elementOnly?: boolean,
  /** Label to use */
  label: string | MessageDescriptor,
  /** Placeholder to render when not uploading */
  placeholder: Node,
  /** Function to handle removal of the avatar (should set avatarURL to null from outside) */
  remove: () => Promise<void>,
  /** Function to handle the actual uploading of the file */
  upload: (fileData: FileReaderFile) => Promise<string>,
};

class AvatarUploader extends Component<Props> {
  dropzoneRef: ?Dropzone;

  registerDropzone = (dropzone: ?Dropzone) => {
    this.dropzoneRef = dropzone;
  };

  choose = () => {
    if (this.dropzoneRef) {
      this.dropzoneRef.open();
    }
  };

  // FileUpload children are renderProps (functions)
  renderOverlay = () => () => (
    <div className={styles.overlay}>
      <FormattedMessage {...MSG.dropNow} />
    </div>
  );

  render() {
    const { elementOnly, label, placeholder, remove, upload } = this.props;
    // Formik is used for state and error handling through FileUpload, nothing else
    return (
      <Formik onSubmit={() => null}>
        <div>
          <FileUpload
            dropzoneRef={this.registerDropzone}
            elementOnly={elementOnly}
            classNames={styles}
            accept={['image/jpeg', 'image/png']}
            label={label}
            maxFilesLimit={1}
            name="avatarUploader"
            renderPlaceholder={placeholder}
            itemComponent={AvatarUploadItem}
            upload={upload}
          >
            {this.renderOverlay()}
          </FileUpload>
          <div className={styles.buttonContainer}>
            <Button
              appearance={{ theme: 'danger' }}
              text={{ id: 'button.remove' }}
              onClick={remove}
            />
            <Button text={{ id: 'button.choose' }} onClick={this.choose} />
          </div>
        </div>
      </Formik>
    );
  }
}

export default AvatarUploader;
