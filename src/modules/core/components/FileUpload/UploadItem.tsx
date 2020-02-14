import React, { Component, SyntheticEvent } from 'react';
import { defineMessages } from 'react-intl';

import { log } from '~utils/debug';
import fileReader from '../../../../lib/fileReader';
import { UploadFile, FileReaderFile } from './types';
import { asField } from '../Fields';
import { Tooltip } from '../Popover';
import Button from '../Button';
import Icon from '../Icon';
import ProgressBar from '../ProgressBar';
import styles from './UploadItem.css';
import { AsFieldEnhancedProps } from '~core/Fields/types';

const MSG = defineMessages({
  removeActionText: {
    id: 'UploadItem.removeActionText',
    defaultMessage: 'Remove',
  },
  uploadError: {
    id: 'UploadItem.uploadError',
    defaultMessage: 'There was an error uploading your file',
  },
  filetypeError: {
    id: 'UploadItem.filetypeError',
    defaultMessage: 'This filetype is not allowed or file is too big',
  },
});

interface Props {
  /** Array of allowed file types */
  accept?: string[];

  /** Index of file in list of files to be uploaded */
  idx: number;

  /** Maximum size of file in bytes */
  maxFileSize?: number;

  /** Function used to remove each file from the list of files to upload */
  remove: (idx: number) => void;

  /** Function used to perform the acutal upload action of the file */
  upload: (file: FileReaderFile) => any;
}

class UploadItem extends Component<Props & AsFieldEnhancedProps<UploadFile>> {
  _readFiles: (files: object[]) => Promise<object[]>;

  static displayName = 'UploadItem';

  constructor(props) {
    super(props);
    const { accept, maxFileSize } = props;
    // @ts-ignore
    this._readFiles = fileReader({
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

  handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { idx, remove } = this.props;
    evt.stopPropagation();
    remove(idx);
  };

  async uploadFile() {
    const { $value, setValue, upload } = this.props;
    if (!setValue) return;
    let readFile;
    let fileReference;
    const { file } = $value;
    try {
      readFile = await this.read(file);
      setValue({ ...$value, preview: readFile.data });
      fileReference = await upload(readFile);
    } catch (caughtError) {
      log.error(caughtError);

      /**
       * @todo  better error handling here
       */
      setValue({ ...$value, error: 'uploadError' });
      return;
    }
    setValue({ ...$value, preview: readFile.data, uploaded: fileReference });
  }

  read = (file: File) => this._readFiles([file]).then(contents => contents[0]);

  render() {
    const {
      $error,
      $value: { file, uploaded },
    } = this.props;

    return (
      <div className={styles.uploadItem} aria-invalid={!!$error}>
        <div className={styles.fileInfo}>
          <Tooltip
            placement="left"
            content={$error || null}
            trigger={$error ? 'hover' : 'disabled'}
          >
            <span className={styles.itemIcon}>
              <Icon name="file" title={file.name} />
            </span>
          </Tooltip>
          {uploaded || $error ? (
            <span>{file.name}</span>
          ) : (
            <div className={styles.itemProgress}>
              <ProgressBar value={uploaded ? 100 : 0} />
            </div>
          )}
        </div>
        <div>
          <Button
            type="button"
            onClick={this.handleRemoveClick}
            appearance={{ theme: 'blue' }}
            text={MSG.removeActionText}
          />
        </div>
      </div>
    );
  }
}

const validate = (value: UploadFile) =>
  value.error ? MSG[value.error] : undefined;

export default asField<Props, UploadFile>({ alwaysConnected: true, validate })(
  UploadItem,
);
