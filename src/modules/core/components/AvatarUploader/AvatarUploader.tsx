import React, { ReactNode, useCallback, useRef } from 'react';
import {
  MessageDescriptor,
  defineMessages,
  FormattedMessage,
} from 'react-intl';

import { Formik } from 'formik';

import { Appearance } from '~core/Fields/Input/InputComponent';

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

export const ACCEPTED_MIME_TYPES: string[] = ['image/png', 'image/svg+xml'];

export const ACCEPTED_MAX_FILE_SIZE = 1048576; // 1 Mb

interface Props {
  /** Only render the Uploader, no label */
  elementOnly?: boolean;

  /** Label to use */
  label: string | MessageDescriptor;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Placeholder to render when not uploading */
  placeholder?: ReactNode;

  /** Function to handle removal of the avatar (should set avatarURL to null from outside) */
  remove: (...args: any[]) => Promise<any>;

  /** Function to handle the actual uploading of the file */
  upload: (fileData: FileReaderFile) => Promise<string>;

  /** Function to handle an upload error from the outside */
  handleError?: (...args: any[]) => Promise<any>;

  /** Used to control the state of the remove button (don't fire the remove action if not avatar is set) */
  isSet?: boolean;

  hasButtons: boolean;

  disabled?: boolean;

  labelAppearance?: Appearance;
}

const AvatarUploader = ({
  elementOnly,
  label,
  help,
  placeholder,
  remove,
  upload,
  hasButtons,
  disabled,
  isSet = true,
  labelAppearance,
  handleError,
}: Props) => {
  const dropzoneRef = useRef<{ open: () => void }>();

  const choose = useCallback(() => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  }, []);

  // FileUpload children are renderProps (functions)
  const renderOverlay = () => () => (
    <div className={styles.overlay}>
      <FormattedMessage {...MSG.dropNow} />
    </div>
  );

  const noButtonStyles = {
    ...styles,
    dropzone: styles.dropzoneNoButtonsVariant,
  };

  // Formik is used for state and error handling through FileUpload, nothing else
  return (
    <Formik onSubmit={() => {}} initialValues={{ avatarUploader: [] }}>
      <form>
        <FileUpload
          elementOnly={elementOnly}
          classNames={hasButtons ? styles : noButtonStyles}
          dropzoneOptions={{
            accept: ACCEPTED_MIME_TYPES,
            maxSize: ACCEPTED_MAX_FILE_SIZE,
            disabled,
          }}
          label={label}
          labelAppearance={labelAppearance}
          help={help}
          maxFilesLimit={1}
          name="avatarUploader"
          renderPlaceholder={placeholder}
          ref={dropzoneRef}
          itemComponent={AvatarUploadItem}
          upload={upload}
          handleError={handleError}
          dataTest="avatarUploaderDrop"
        >
          {renderOverlay()}
        </FileUpload>
        {hasButtons && (
          <div className={styles.buttonContainer}>
            <Button
              appearance={{ theme: 'danger' }}
              text={{ id: 'button.remove' }}
              onClick={remove}
              disabled={!isSet}
              dataTest="avatarUploaderRemove"
            />
            <Button
              text={{ id: 'button.choose' }}
              onClick={choose}
              dataTest="avatarUploaderChoose"
            />
          </div>
        )}
      </form>
    </Formik>
  );
};

export default AvatarUploader;
