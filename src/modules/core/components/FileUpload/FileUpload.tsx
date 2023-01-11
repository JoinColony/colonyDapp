import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useMemo,
  useImperativeHandle,
  Ref,
} from 'react';
import { MessageDescriptor, defineMessages } from 'react-intl';
import { DropzoneOptions, DropzoneState, useDropzone } from 'react-dropzone';
import { getIn } from 'formik';
import { compose } from 'recompose';

import { AsFieldArrayEnhancedProps } from '~core/Fields/asFieldArray';
import { Appearance } from '~core/Fields/Input/InputComponent';
import { SimpleMessageValues, UniversalMessageValues } from '~types/index';
import { withForwardingRef, ForwardedRefProps } from '~utils/hoc';

import DefaultPlaceholder from './DefaultPlaceholder';
import { DEFAULT_MIME_TYPES, DEFAULT_MAX_FILE_SIZE } from './limits';
import { UploadFn, UploadItemComponentProps, ValidateFileFn } from './types';
import UploadItem from './UploadItem';

import { asFieldArray } from '../Fields';
import InputLabel from '../Fields/InputLabel';
import InputStatus, { InputStatusAppearance } from '../Fields/InputStatus';

import styles from './FileUpload.css';

const MSG = defineMessages({
  labelError: {
    id: 'FileUpload.labelError',
    defaultMessage: 'There was an error processing your file. Try again.',
  },
  uploadError: {
    id: 'FileUpload.uploadError',
    defaultMessage: 'There was an error uploading your file',
  },
  filetypeError: {
    id: 'FileUpload.filetypeError',
    defaultMessage: 'This filetype is not allowed or file is too big',
  },
});

interface Props {
  /** Content to render inside the dropzone */
  children?: ReactNode | ((props: DropzoneState) => ReactNode);
  /** Custom classNames for different elements of the component */
  classNames?: {
    main?: string;
    dropzone?: string;
    dropzoneAccept?: string;
    dropzoneReject?: string;
    filesContainer?: string;
    disabled?: string;
  };
  /** Options for the dropzone provider */
  dropzoneOptions?: DropzoneOptions;
  /** Whether to display the element all by itself, or with labels & whatnot */
  elementOnly?: boolean;
  /** Extra node to render on the top right in the label */
  extra?: ReactNode;
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;
  /** Values for help text (react-intl interpolation) */
  helpValues?: UniversalMessageValues;
  /** Element html `id` */
  id?: string;
  /** The component to render each item to be uploaded */
  itemComponent?: ComponentType<UploadItemComponentProps>;
  /** Label text */
  label?: string | MessageDescriptor;
  /** Values for label text (react-intl interpolation) */
  labelValues?: SimpleMessageValues;
  /** Maximum number of files to accept */
  maxFilesLimit?: number;
  /** Max file size */
  maxSize?: number;
  /** Input control `name` attribute */
  name: string;
  /** Placeholder element for when no files have been picked yet (renderProp) */
  renderPlaceholder?: ReactNode | null;
  /** Ref for programmatic opening */
  ref?: Ref<any>;
  /** Status text */
  status?: string | MessageDescriptor;
  /** Function to handle the actual uploading of the file */
  upload: UploadFn;
  /** Function to handle an upload error from the outside */
  handleError?: (...args: any[]) => Promise<any>;

  labelAppearance?: Appearance;

  customErrorMessage?: string | MessageDescriptor;

  inputStatusAppearance?: InputStatusAppearance;

  processingData?: boolean;

  handleProcessingData?: (...args: any) => void;
  /** Testing */
  dataTest?: string;
}

const validateFile: ValidateFileFn = (value) =>
  value.error ? MSG[value.error] : undefined;

const FileUpload = ({
  children,
  classNames = styles,
  dropzoneOptions: { accept: acceptProp, disabled, ...dropzoneOptions } = {},
  elementOnly,
  extra,
  form: { errors, resetForm, values },
  forwardedRef: ref,
  help,
  helpValues,
  id,
  itemComponent: FileUploaderItem = UploadItem,
  label,
  labelValues,
  maxFilesLimit = 1,
  maxSize = DEFAULT_MAX_FILE_SIZE,
  name,
  push,
  remove,
  renderPlaceholder = <DefaultPlaceholder />,
  status,
  upload,
  handleError,
  labelAppearance,
  customErrorMessage,
  inputStatusAppearance,
  processingData,
  dataTest,
  handleProcessingData,
}: AsFieldArrayEnhancedProps<Props> & ForwardedRefProps) => {
  const files = useMemo(() => getIn(values, name) || [], [name, values]);
  const fileErrors = useMemo(() => getIn(errors, name) || [], [errors, name]);

  const maxFileLimitNotMet = files.length < maxFilesLimit;
  const hasError = !!fileErrors.length;

  const accept = useMemo<string[]>(() => {
    if (!acceptProp) {
      return DEFAULT_MIME_TYPES;
    }
    if (!Array.isArray(acceptProp)) {
      return [acceptProp];
    }
    return acceptProp;
  }, [acceptProp]);

  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      const countAcceptedFiles = files.filter(({ error }) => !error);
      const newFiles = Array.from(acceptedFiles).slice(
        0,
        maxFilesLimit - countAcceptedFiles.length,
      );
      newFiles.forEach((file) => push({ file }));
    },
    [files, maxFilesLimit, push],
  );

  const onDropRejected = useCallback(
    (rejectedFiles) => {
      rejectedFiles
        .slice(0, maxFilesLimit - files.length)
        .forEach((file) => push({ ...file, error: 'filetypeError' }));
    },
    [files.length, maxFilesLimit, push],
  );

  const dropzoneState = useDropzone({
    accept,
    disabled: disabled || !maxFileLimitNotMet,
    maxSize,
    onDropAccepted,
    onDropRejected,
    // We can override the above properties by providing these in the `dropzoneOptions` prop
    ...dropzoneOptions,
  });

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    open,
  } = dropzoneState;

  const renderExtraChildren = useCallback(() => {
    if (!children) return null;
    if (typeof children === 'function') {
      return children(dropzoneState);
    }
    return children;
  }, [children, dropzoneState]);

  const dropzoneClassName = useMemo(() => {
    const classes = [
      classNames.dropzone,
      ...(disabled ? [classNames.disabled] : []),
    ];
    if (isDragAccept) {
      classes.push(classNames.dropzoneAccept);
    } else if (isDragReject) {
      classes.push(classNames.dropzoneReject);
    }
    return classes.join(' ');
  }, [
    classNames.dropzone,
    classNames.dropzoneAccept,
    classNames.dropzoneReject,
    classNames.disabled,
    disabled,
    isDragAccept,
    isDragReject,
  ]);

  useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <div className={classNames.main} id={id}>
      {!elementOnly && label && (
        <InputLabel
          appearance={labelAppearance}
          label={label}
          help={help}
          labelValues={labelValues}
          helpValues={helpValues}
          extra={extra}
        />
      )}
      <div
        className={dropzoneClassName}
        {...getRootProps()}
        data-test={dataTest}
      >
        <input {...getInputProps()} />
        {maxFileLimitNotMet && renderPlaceholder}
        {files && files.length > 0 && (
          <div className={classNames.filesContainer}>
            {files.map((file, idx) => (
              <FileUploaderItem
                accept={accept}
                error={file.error}
                key={`${file.name}-${file.size}`}
                idx={idx}
                maxFileSize={maxSize}
                name={`${name}.${idx}`}
                remove={remove}
                reset={resetForm}
                upload={upload}
                validate={validateFile}
                handleError={handleError}
                processingData={processingData}
                handleProcessingData={handleProcessingData}
              />
            ))}
          </div>
        )}
        {renderExtraChildren()}
      </div>
      <InputStatus
        appearance={inputStatusAppearance}
        status={status}
        error={hasError ? customErrorMessage || MSG.labelError : ''}
      />
    </div>
  );
};

const enhance = compose<
  AsFieldArrayEnhancedProps<Props> & ForwardedRefProps,
  Props
>(
  // @NOTE ordering matters here - refs first!
  withForwardingRef,
  asFieldArray(),
);

export default enhance(FileUpload) as ComponentType<Props>;
