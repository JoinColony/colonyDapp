import { FieldArrayRenderProps } from 'formik';

export interface FileReaderFile {
  name: string;
  type: string;
  size: number;
  lastModified: string;
  uploadDate: Date;
  data: string;
}

export interface UploadFile {
  file: File;
  uploaded?: string;
  error?: string;
  preview?: string;
  parsedData?: string[];
}

export interface UploadItemComponentProps {
  accept: string[];
  error?: string;
  key: string;
  idx: number;
  maxFileSize: number;
  name: string;
  remove: FieldArrayRenderProps['remove'];
  reset: FieldArrayRenderProps['form']['resetForm'];
  upload: UploadFn;
  validate: ValidateFileFn;
  handleError?: (...args: any[]) => Promise<any>;
}

export type UploadFn = (fileData: FileReaderFile | File) => any;

export type ValidateFileFn = (value: UploadFile) => string | undefined;
