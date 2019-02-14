/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import styles from './AvatarUploadItem.css';

import type { FileReaderFile, UploadFile } from '../FileUpload';

import fileReader from '../../../lib/fileReader';
import { asField } from '../Fields';
import Icon from '../Icon';

const MSG = defineMessages({
  uploadError: {
    id: 'AvatarUploadItem.uploadError',
    defaultMessage: 'There was an error uploading your file',
  },
  filetypeError: {
    id: 'AvatarUploadItem.filetypeError',
    defaultMessage: 'This filetype is not allowed or file is too big',
  },
});

type Props = {|
  /** Array of allowed file types */
  accept?: string[],
  /** Function used to perform the acutal upload action of the file */
  upload: (file: FileReaderFile) => any,
  /** Maximum size of file in bytes */
  maxFileSize?: number,
  /** Will reset the entire AvatarUploader state */
  reset: () => void,
  /** @ignore Will be injected by `asField` */
  $value: UploadFile,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
|};

class AvatarUploadItem extends Component<Props> {
  readFiles: (files: Array<Object>) => Promise<Array<Object>>;

  static displayName = 'AvatarUploadItem';

  constructor(props: Props) {
    super(props);
    const { accept, maxFileSize } = props;
    this.readFiles = fileReader({
      maxFilesLimit: 1,
      maxFileSize,
      allowedTypes: accept,
    });
  }

  componentDidMount() {
    const {
      $value: { error, file, uploaded },
    } = this.props;

    if (file && !error && !uploaded) {
      this.uploadFile();
    }
  }

  async uploadFile() {
    const { $value, setValue, reset, upload } = this.props;
    let readFile;
    const { file } = $value;
    try {
      readFile = await this.read(file);
      setValue({ ...$value, preview: readFile.data });
      await upload(readFile);
    } catch (e) {
      // TODO better error handling here
      setValue({ ...$value, error: 'uploadError' });
    }
    // After successfully uploading the file we'd like to immediately remove it again.
    reset();
  }

  read = (file: File) => this.readFiles([file]).then(contents => contents[0]);

  render() {
    const {
      $error,
      $value: { preview },
    } = this.props;
    return (
      <div className={styles.main}>
        {!$error ? (
          <div
            className={styles.previewImage}
            style={{ backgroundImage: preview ? `url(${preview}` : null }}
          >
            <div className={styles.overlay}>
              <div className={styles.loader} />
            </div>
          </div>
        ) : (
          <div className={styles.error}>
            <Icon name="file" appearance={{ size: 'large' }} title={$error} />
          </div>
        )}
      </div>
    );
  }
}

const validate = (value: UploadFile) =>
  value.error ? MSG[value.error] : undefined;

export default asField({ alwaysConnected: true, validate })(AvatarUploadItem);
