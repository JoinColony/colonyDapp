/* @flow */

import type { ComponentType, Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { getIn } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { UploadFile } from './types';

import styles from './FileUpload.css';

import { asFieldArray } from '../Fields';
import InputLabel from '../Fields/InputLabel';
import UploadItem from './UploadItem.jsx';

const MSG = defineMessages({
  dropzoneText: {
    id: 'FileUpload.dropzoneText',
    defaultMessage: 'Drag or {browse}',
  },
  labelError: {
    id: 'FileUpload.labelError',
    defaultMessage:
      'There was an error processing your file. Hover over its icon',
  },
  dropzoneTextBrowseAction: {
    id: 'FileUpload.dropzoneTextBrowseAction',
    defaultMessage: 'browse',
  },
});

type Props = {
  /** Allow specific types of files. See https://github.com/okonet/attr-accept for more information. Keep in mind that mime type determination is not reliable across platforms. CSV files, for example, are reported as text/plain under macOS but as application/vnd.ms-excel under Windows. In some cases there might not be a mime type set at all. See: https://github.com/react-dropzone/react-dropzone/issues/276 */
  accept?: Array<string>,
  classNames: {
    main: string,
    dropzone: string,
    dropzoneActive: string,
    dropzoneReject: string,
    filesContainer: string,
  },
  /** Disable the file selection dialog box opening when clicking anywhere in the dropzone */
  disableClick?: boolean,
  /** Standard html ID */
  id?: string,
  /** Component to act as the form field  */
  itemComponent: ComponentType<*>,
  /** Maximum number of files to accept */
  maxFilesLimit: number,
  /** Maximum filesize to accept (per-file) */
  maxFileSize: number,
  /** Function to handle the actual uploading of the file */
  upload: (fileData: string) => string,
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
  /** Placeholder element for when no files have been picked yet */
  placeholderElement?: Node,
  /** @ignore injected by `asFieldArray` */
  form: { [string]: any },
  /** @ignore injected by `asFieldArray` */
  push: (file: UploadFile) => void,
  /** @ignore injected by `asFieldArray` */
  remove: (idx: number) => void,
};

const Placeholder = () => (
  <div className={styles.placeholderText}>
    <FormattedMessage
      {...MSG.dropzoneText}
      values={{
        browse: (
          <span className={styles.browseButton}>
            <FormattedMessage {...MSG.dropzoneTextBrowseAction} />
          </span>
        ),
      }}
    />
  </div>
);

class FileUpload extends Component<Props> {
  static displayName = 'FileUpload';

  static defaultProps = {
    appearance: { align: 'center' },
    classNames: styles,
    disableClick: false,
    itemComponent: UploadItem,
    maxFilesLimit: 1,
    maxFileSize: 1024 * 1024,
    placeholderElement: <Placeholder />,
  };

  addFiles = (acceptedFiles: Array<File>): void => {
    const {
      form: { values },
      name,
      maxFilesLimit,
      push,
    } = this.props;
    const files = getIn(values, name) || [];
    const countAcceptedFiles = files.filter(file => !file.error);
    const newFiles = Array.from(acceptedFiles).slice(
      0,
      maxFilesLimit - countAcceptedFiles.length,
    );
    newFiles.forEach(file => {
      push({ file });
    });
  };

  addRejectedFiles = (rejectedFiles: Array<Object>): void => {
    const {
      form: { values },
      maxFilesLimit,
      push,
      name,
    } = this.props;
    const files = getIn(values, name) || [];
    rejectedFiles.slice(0, maxFilesLimit - files.length).forEach(file => {
      push({ file, error: 'filetypeError' });
    });
  };

  render() {
    const {
      accept,
      classNames,
      disableClick,
      form: { values, isValid, dirty },
      help,
      helpValues,
      itemComponent: FileUploaderItem,
      id,
      label,
      labelValues,
      maxFileSize,
      maxFilesLimit,
      name,
      placeholderElement,
      remove,
      removeActionText,
      upload,
    } = this.props;

    const files = getIn(values, name) || [];

    const maxFileLimitNotMet = files.length < maxFilesLimit;
    const hasError = dirty && !isValid;

    return (
      <div className={classNames.main} id={id}>
        {label && (
          <InputLabel
            label={label}
            help={help}
            error={hasError ? MSG.labelError : ''}
            labelValues={labelValues}
            helpValues={helpValues}
          />
        )}
        <Dropzone
          accept={accept}
          aria-invalid={hasError}
          className={classNames.dropzone}
          activeClassName={classNames.dropzoneActive}
          rejectClassName={classNames.dropzoneReject}
          onDropAccepted={this.addFiles}
          onDropRejected={this.addRejectedFiles}
          disableClick={disableClick || !maxFileLimitNotMet}
          maxSize={maxFileSize}
        >
          {maxFileLimitNotMet && placeholderElement}
          {files &&
            files.length > 0 && (
              <div className={classNames.filesContainer}>
                {files.map((file, idx) => (
                  <FileUploaderItem
                    key={`${file.name}-${file.size}`}
                    idx={idx}
                    name={`${name}.${idx}`}
                    remove={remove}
                    upload={upload}
                    removeActionText={removeActionText}
                  />
                ))}
              </div>
            )}
        </Dropzone>
      </div>
    );
  }
}

export default asFieldArray()(FileUpload);
