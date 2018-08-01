/* @flow */
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import nanoid from 'nanoid';

import type { IntlShape, MessageDescriptor } from 'react-intl';
import type { Dropzone as DropzoneType } from 'react-dropzone';

import { immutableReplaceAt } from '~utils/arrays';
import { getMainClasses } from '~utils/css';
import fileReader from '~lib/fileReader';

import InputLabel from '../InputLabel';
import UploadItem from './UploadItem';
import styles from './FileUpload.css';

// TODO replace with real file upload handler - this is only used here in defaultPorps during development
const mockUploader = fileData =>
  Promise.resolve(`someIpfsHash-${fileData.slice(20)}`);

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
  /** Connect upload items to form state (will inject `$value`, `$id`, `$error`, `$touched` to upload items), is `true` by default */
  connect?: boolean,
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
    this.state = {
      files: [],
      rejectedFiles: [],
      errorMessage: '',
    };
    this.readFiles = fileReader({ maxFilesLimit, maxFileSize });
  }

  addFiles = (filesToUpload: Array<File>): void => {
    const { files } = this.state;
    const { maxFilesLimit } = this.props;
    const newFiles = Array.from(filesToUpload)
      .slice(0, maxFilesLimit - files.length)
      .map(file => ({
        id: nanoid(),
        fileRef: file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
    this.setState({
      files: [...files, ...newFiles],
    });
  };

  addRejectedFiles = (attemptedFilesToUpload: Array<Object>): void => {
    const {
      intl: { formatMessage },
      maxFilesLimit,
    } = this.props;
    const { rejectedFiles } = this.state;
    const newFiles = Array.from(attemptedFilesToUpload)
      .slice(0, maxFilesLimit - rejectedFiles.length)
      .map(file => ({
        id: nanoid(),
        fileRef: file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
    const updatedFiles = [...rejectedFiles, ...newFiles];
    this.setState({
      rejectedFiles: updatedFiles,
      errorMessage: formatMessage(MSG.uploadErrorWrongFileText),
    });
  };

  removeRejectedFile = (idx: number): void => {
    const { errorMessage, rejectedFiles } = this.state;
    const updatedFiles = rejectedFiles.length
      ? rejectedFiles.filter((_, fileIdx) => idx !== fileIdx)
      : [];
    this.setState({
      rejectedFiles: updatedFiles,
      errorMessage: updatedFiles.length === 0 ? '' : errorMessage,
    });
  };

  read = (file: File) => this.readFiles([file]).then(contents => contents[0]);

  removeFile = (idx: number): void => {
    const { onRemoved } = this.props;
    const { errorMessage, files } = this.state;
    const removedFile = files[idx];
    const newFiles = files.length
      ? files.filter((_, fileIdx) => idx !== fileIdx)
      : [];
    this.setState({
      files: newFiles,
      errorMessage: newFiles.length === 0 ? '' : errorMessage,
    });
    if (onRemoved) {
      onRemoved(removedFile, newFiles);
    }
  };

  handleOpenFileDialog = (evt: SyntheticEvent<HTMLButtonElement>): void => {
    evt.stopPropagation();
    this.dropzone.open();
  };

  handleUploaded = (idx: number, ipfsHash: string): void => {
    const { files } = this.state;
    const { onUploaded } = this.props;
    const uploadedFile = { ...files[idx], fileRef: null, ipfsHash };
    const newFiles = immutableReplaceAt(files, idx, uploadedFile);
    this.setState({
      files: newFiles,
    });
    if (onUploaded) {
      onUploaded(uploadedFile, newFiles);
    }
  };

  handleUploadError = (errorMessage?: MessageDescriptor | string): void => {
    const {
      intl: { formatMessage },
    } = this.props;
    let formattedErrorMessage;
    if (!errorMessage) {
      formattedErrorMessage = formatMessage(MSG.uploadErrorText);
    } else if (typeof errorMessage == 'object') {
      formattedErrorMessage = formatMessage(errorMessage);
    } else {
      formattedErrorMessage = errorMessage;
    }
    this.setState({
      errorMessage: formattedErrorMessage,
    });
  };

  render() {
    const {
      accept,
      appearance,
      connect,
      disableClick,
      help,
      helpValues,
      itemComponent: FileUploaderItem,
      id,
      label,
      labelValues,
      maxFilesLimit,
      name,
      removeActionText,
      upload,
    } = this.props;

    const { errorMessage, files, rejectedFiles } = this.state;
    const containerClasses = getMainClasses(appearance, styles);

    const maxFileLimitNotMet =
      files.length + rejectedFiles.length < maxFilesLimit;

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
            aria-invalid={!!errorMessage || rejectedFiles.length > 0}
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
            {(files.length > 0 || rejectedFiles.length > 0) &&
              maxFileLimitNotMet && <hr />}
            {files &&
              files.length > 0 && (
                <div className={styles.filesToUpload}>
                  {files.map((file, idx) => (
                    <FileUploaderItem
                      connect={connect}
                      key={file.id}
                      file={file}
                      idx={idx}
                      name={`${name}-${idx}`}
                      onError={this.handleUploadError}
                      onUploaded={this.handleUploaded}
                      read={this.read}
                      remove={this.removeFile}
                      upload={upload}
                      removeActionText={removeActionText}
                    />
                  ))}
                </div>
              )}
            {rejectedFiles.map((file, idx) => (
              <FileUploaderItem
                connect={false}
                idx={idx}
                file={file}
                key={file.id}
                remove={this.removeRejectedFile}
                read={this.read}
              />
            ))}
          </Dropzone>
        </div>
        {errorMessage && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{errorMessage}</p>
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(FileUpload);
