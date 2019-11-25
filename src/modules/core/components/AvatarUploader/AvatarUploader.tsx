import React, { ReactNode, Component } from 'react';
import {
  MessageDescriptor,
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import { Formik } from 'formik';
import Dropzone from 'react-dropzone';

import styles from './AvatarUploader.css';

import FileUpload, { FileReaderFile } from '../FileUpload';

import Button from '../Button';

import AvatarUploadItem from './AvatarUploadItem';

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

export const ACCEPTED_MIME_TYPES: string[] = ['image/png', 'image/jpeg'];

export const ACCEPTED_MAX_FILE_SIZE = 2097152; // 2MB

interface Props {
  /** Only render the Uploader, no label */
  elementOnly?: boolean;

  /** Label to use */
  label: string | MessageDescriptor;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Placeholder to render when not uploading */
  placeholder: ReactNode;

  /** Function to handle removal of the avatar (should set avatarURL to null from outside) */
  remove: (...args: any[]) => Promise<any>;

  /** Function to handle the actual uploading of the file */
  upload: (fileData: FileReaderFile) => Promise<string>;

  /** Used to control the state of the remove button (don't fire the remove action if not avatar is set) */
  isSet?: boolean;
}

class AvatarUploader extends Component<Props> {
  dropzoneRef?: Dropzone | null;

  registerDropzone = (dropzone: Dropzone | null) => {
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
    const {
      elementOnly,
      label,
      help,
      placeholder,
      remove,
      upload,
      isSet = true,
    } = this.props;
    // Formik is used for state and error handling through FileUpload, nothing else
    return (
      <Formik onSubmit={() => {}} initialValues={{ avatarUploader: [] }}>
        <form>
          <FileUpload
            dropzoneRef={this.registerDropzone}
            elementOnly={elementOnly}
            classNames={styles}
            accept={ACCEPTED_MIME_TYPES}
            label={label}
            help={help}
            maxFilesLimit={1}
            maxFileSize={ACCEPTED_MAX_FILE_SIZE}
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
              disabled={!isSet}
              data-test="avatarUploaderRemove"
            />
            <Button
              text={{ id: 'button.choose' }}
              onClick={this.choose}
              data-test="avatarUploaderChoose"
            />
          </div>
        </form>
      </Formik>
    );
  }
}

export default AvatarUploader;
