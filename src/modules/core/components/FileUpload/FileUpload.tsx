import React, { ComponentType, ReactNode, Component } from 'react';
import {
  MessageDescriptor,
  defineMessages,
  FormattedMessage,
} from 'react-intl';
import Dropzone from 'react-dropzone';
import { getIn } from 'formik';

import { SimpleMessageValues } from '~types/index';

import { FileReaderFile, UploadFile } from './types';
import { DEFAULT_MIME_TYPES, DEFAULT_MAX_FILE_SIZE } from './limits';

import { asFieldArray } from '../Fields';
import InputLabel from '../Fields/InputLabel';
import InputStatus from '../Fields/InputStatus';
import UploadItem from './UploadItem';

import styles from './FileUpload.css';

const MSG = defineMessages({
  dropzoneText: {
    id: 'FileUpload.dropzoneText',
    defaultMessage: 'Drag or {browse}',
  },
  labelError: {
    id: 'FileUpload.labelError',
    defaultMessage: 'There was an error processing your file. Try again.',
  },
  dropzoneTextBrowseAction: {
    id: 'FileUpload.dropzoneTextBrowseAction',
    defaultMessage: 'browse',
  },
});

interface ChildProps {
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
}

interface Props {
  /** Allow specific types of files. See https://github.com/okonet/attr-accept for more information. Keep in mind that mime type determination is not reliable across platforms. CSV files, for example, are reported as text/plain under macOS but as application/vnd.ms-excel under Windows. In some cases there might not be a mime type set at all. See: https://github.com/react-dropzone/react-dropzone/issues/276 */
  accept?: string[];
  children?: ReactNode | ((props: ChildProps) => ReactNode);
  /** Custom classNames for different elements of the component */
  classNames: {
    main: string;
    dropzone: string;
    dropzoneActive: string;
    dropzoneReject: string;
    filesContainer: string;
  };
  /** Disable the file selection dialog box opening when clicking anywhere in the dropzone */
  disableClick?: boolean;
  /** Get a reference to dropzone, if needed */
  dropzoneRef?: (ref: Dropzone) => void;
  /** Just render the element without label */
  elementOnly?: boolean;
  /** Standard html ID */
  id?: string;
  /** Component to act as the form field  */
  itemComponent: ComponentType<any>;
  /** Maximum number of files to accept */
  maxFilesLimit: number;
  /** Maximum filesize to accept (per-file) */
  maxFileSize: number;
  /** Function to handle the actual uploading of the file */
  upload: (fileData: FileReaderFile) => string;
  /** Input field name (form variable) */
  name: string;
  /** Status text */
  status?: string | MessageDescriptor;
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;
  /** Values for help text (react-intl interpolation) */
  helpValues?: SimpleMessageValues;
  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  /** Label text */
  label?: string | MessageDescriptor;
  /** Values for label text (react-intl interpolation) */
  labelValues?: SimpleMessageValues;
  /** Placeholder element for when no files have been picked yet (renderProp) */
  renderPlaceholder?: ReactNode | null;
  /** @ignore injected by `asFieldArray` */
  form: { [k: string]: any };
  /** @ignore injected by `asFieldArray` */
  push: (file: UploadFile) => void;
  /** @ignore injected by `asFieldArray` */
  remove: (idx: number) => void;
}

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
    accept: DEFAULT_MIME_TYPES,
    classNames: styles,
    disableClick: false,
    itemComponent: UploadItem,
    maxFilesLimit: 1,
    maxFileSize: DEFAULT_MAX_FILE_SIZE,
    renderPlaceholder: <Placeholder />,
  };

  addFiles = (acceptedFiles: File[]): void => {
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

  addRejectedFiles = (rejectedFiles: any[]): void => {
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

  renderExtraChildren = (childProps: ChildProps) => {
    const { children } = this.props;
    if (!children) return null;
    if (typeof children == 'function') {
      // @ts-ignore
      return children(childProps);
    }
    return children;
  };

  render() {
    const {
      accept,
      classNames,
      disableClick,
      elementOnly,
      dropzoneRef,
      form: { values, errors, resetForm },
      help,
      extra,
      helpValues,
      itemComponent: FileUploaderItem,
      id,
      label,
      labelValues,
      maxFileSize,
      maxFilesLimit,
      name,
      renderPlaceholder,
      remove,
      upload,
      status,
    } = this.props;

    const files = getIn(values, name) || [];
    const fileErrors = getIn(errors, name) || [];

    const maxFileLimitNotMet = files.length < maxFilesLimit;
    const hasError = !!fileErrors.length;

    return (
      <div className={classNames.main} id={id}>
        {!elementOnly && label && (
          <InputLabel
            label={label}
            help={help}
            labelValues={labelValues}
            helpValues={helpValues}
            extra={extra}
          />
        )}
        <Dropzone
          // @ts-ignore
          accept={accept}
          aria-invalid={hasError}
          className={classNames.dropzone}
          activeClassName={classNames.dropzoneActive}
          rejectClassName={classNames.dropzoneReject}
          onDropAccepted={this.addFiles}
          onDropRejected={this.addRejectedFiles}
          disableClick={disableClick || !maxFileLimitNotMet}
          maxSize={maxFileSize}
          ref={dropzoneRef}
          data-test="avatarUploaderDrop"
        >
          {childProps => (
            <>
              {maxFileLimitNotMet && renderPlaceholder}
              {files && files.length > 0 && (
                <div className={classNames.filesContainer}>
                  {files.map(({ file }, idx) => (
                    <FileUploaderItem
                      accept={accept}
                      key={`${file.name}-${file.size}`}
                      idx={idx}
                      name={`${name}.${idx}`}
                      remove={remove}
                      reset={resetForm}
                      upload={upload}
                    />
                  ))}
                </div>
              )}
              {this.renderExtraChildren(childProps)}
            </>
          )}
        </Dropzone>
        <InputStatus status={status} error={hasError ? MSG.labelError : ''} />
      </div>
    );
  }
}

export default asFieldArray()(FileUpload);
