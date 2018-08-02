/* @flow */
import React, { Component, Fragment } from 'react';
import { compose } from 'recompose';
import Dropzone from 'react-dropzone';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import type { IntlShape, MessageDescriptor } from 'react-intl';
import type { Dropzone as DropzoneType } from 'react-dropzone';

import { getMainClasses } from '~utils/css';
import fileReader from '~lib/fileReader';

import asFieldArray from '../asFieldArray';
import InputLabel from '../InputLabel';
import UploadItem from './UploadItem';
import styles from './FileUpload.css';

// TODO replace with real file upload handler - this is only used here in defaultProps during development
const mockUploader = async fileData => `someIpfsHash-${fileData.slice(20)}`;

const MSG = defineMessages({
  dropzoneText: {
    id: 'dropzoneText',
    defaultMessage: 'Drag or {browse}',
  },
  uploadErrorText: {
    id: 'dropzoneUploadErrorDisplay',
    defaultMessage: 'There was an issue uploading one of your files',
  },
  uploadErrorWrongFileText: {
    id: 'dropzoneUploadErrorWrongFileText',
    defaultMessage: 'Oops, wrong file',
  },
});

type Appearance = {
  align?: 'left' | 'center' | 'right',
};

type Props = {
  /** Allow specific types of files. See https://github.com/okonet/attr-accept for more information. Keep in mind that mime type determination is not reliable across platforms. CSV files, for example, are reported as text/plain under macOS but as application/vnd.ms-excel under Windows. In some cases there might not be a mime type set at all. See: https://github.com/react-dropzone/react-dropzone/issues/276 */
  accept?: Array<string>,
  /** Appearance object */
  appearance: Appearance,
  /** Disable the file selection dialog box opening when clicking anywhere in the dropzone */
  disableClick?: boolean,
  /** Standard html ID */
  id?: string,
  /** Component to act as the form field  */
  itemComponent: Function,
  /** Maximum number of files to accept */
  maxFilesLimit: number,
  /** Maximum filesize to accept (per-file) */
  maxFileSize: number,
  /** Function called when a file is removed */
  onRemoved?: Function,
  /** Function called when a file is uploaded */
  onUploaded?: Function,
  /** Function to handle the actual uploading of the file */
  upload: Function,
  /** Text used in the item component as the "remove" button */
  removeActionText?: MessageDescriptor | string,
  /** Input field name (form variable) */
  name: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Label text */
  label?: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** @ignore injected by `asFieldArray` */
  form: { [string]: any },
  /** @ignore injected by `asFieldArray` */
  push: (file: Object) => void,
  /** @ignore injected by `asFieldArray` */
  remove: (idx: number) => void,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

type State = {
  files: Array<Object>,
  rejectedFiles: Array<Object>,
  errorMessage: string,
};

class FileUpload extends Component<Props, State> {
  dropzone: DropzoneType;

  readFiles: Function;

  static displayName = 'FileUpload';

  static defaultProps = {
    appearance: { align: 'center' },
    disableClick: true,
    itemComponent: UploadItem,
    maxFilesLimit: 1,
    maxFileSize: 1024 * 1024,
    upload: mockUploader,
  };

  constructor(props: Props) {
    super(props);
    const { maxFilesLimit, maxFileSize } = props;
    this.readFiles = fileReader({ maxFilesLimit, maxFileSize });
  }

  addFiles = (filesToUpload: Array<File>): void => {
    const {
      form: { values },
      name,
      maxFilesLimit,
      push,
    } = this.props;
    const files = values[name] || [];
    const countAcceptedFiles = files.filter(file => !file.error);
    const newFiles = Array.from(filesToUpload).slice(
      0,
      maxFilesLimit - countAcceptedFiles.length,
    );
    newFiles.forEach(file => {
      push({
        file,
        uploaded: false,
        error: null,
      });
    });
  };

  addRejectedFiles = (attemptedFilesToUpload: Array<Object>): void => {
    const {
      form: { values },
      maxFilesLimit,
      push,
      name,
    } = this.props;
    const files = values[name] || [];
    attemptedFilesToUpload
      .slice(0, maxFilesLimit - files.length)
      .forEach(file => {
        push({
          file,
          uploaded: false,
          error: 'filetype',
        });
      });
  };

  read = (file: File) => this.readFiles([file]).then(contents => contents[0]);

  handleOpenFileDialog = (evt: SyntheticEvent<HTMLButtonElement>): void => {
    evt.stopPropagation();
    this.dropzone.open();
  };

  render() {
    const {
      accept,
      appearance,
      disableClick,
      form: { dirty, errors, isValid, values },
      help,
      helpValues,
      itemComponent: FileUploaderItem,
      id,
      label,
      labelValues,
      maxFilesLimit,
      name,
      remove,
      removeActionText,
      upload,
    } = this.props;

    const files = values[name] || [];
    const containerClasses = getMainClasses(appearance, styles);

    const maxFileLimitNotMet = files.length < maxFilesLimit;

    const browseLink = (
      <button
        type="button"
        onClick={this.handleOpenFileDialog}
        className={styles.browseButton}
      >
        browse
      </button>
    );

    return (
      <div className={styles.mainContainer} id={id}>
        {label && (
          <InputLabel
            label={label}
            help={help}
            labelValues={labelValues}
            helpValues={helpValues}
          />
        )}
        <div className={containerClasses}>
          <Dropzone
            accept={accept}
            aria-invalid={!isValid && dirty}
            ref={dropzone => {
              this.dropzone = dropzone;
            }}
            onDrop={this.addFiles}
            className={styles.dropzone}
            activeClassName={styles.dropzoneActive}
            rejectClassName={styles.dropzoneReject}
            onDropRejected={this.addRejectedFiles}
            disableClick={disableClick || !maxFileLimitNotMet}
          >
            {maxFileLimitNotMet && (
              <div className={styles.dropzoneText}>
                <FormattedMessage
                  values={{ browse: browseLink }}
                  {...MSG.dropzoneText}
                />
              </div>
            )}
            {files &&
              files.length > 0 && (
                <Fragment>
                  {maxFileLimitNotMet && <hr />}
                  <div className={styles.filesToUpload}>
                    {files.map((file, idx) => (
                      <FileUploaderItem
                        key={`${file.name}-${file.size}`}
                        file={file}
                        idx={idx}
                        name={`${name}.${idx}`}
                        read={this.read}
                        remove={remove}
                        upload={upload}
                        removeActionText={removeActionText}
                      />
                    ))}
                  </div>
                </Fragment>
              )}
          </Dropzone>
        </div>
        {errors &&
          errors.length > 0 && (
            <div className={styles.errorContainer}>
              {errors.map(errorMessage => (
                <p className={styles.errorText}>{errorMessage}</p>
              ))}
            </div>
          )}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  asFieldArray(),
)(FileUpload);
