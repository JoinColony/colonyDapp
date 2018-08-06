/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { MessageDescriptor } from 'react-intl';
import fileReader from '../../../../../../lib/fileReader';

import type { UploadFile } from '../types';

import asField from '../../asField';
import Tooltip from '../../../Popover/Tooltip.jsx';
import Button from '../../../Button';
import Icon from '../../../Icon';
import ProgressBar from '../../../ProgressBar';

import styles from './UploadItem.css';

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
    defaultMessage: 'This filetype is not allowed',
  },
});

type Props = {
  /** Index of file in list of files to be uploaded */
  idx: number,
  /** Text to be shown for removing an item */
  removeActionText: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  removeActionTextValues?: { [string]: string },
  /** Function used to remove each file from the list of files to upload */
  remove: (idx: number) => void,
  /** Function used to perform the acutal upload action of the file */
  upload: (fileData: string) => string,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** @ignore Will be injected by `asField` */
  $value: UploadFile,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
};

class UploadItem extends Component<Props> {
  static displayName = 'UploadItem';

  static defaultProps = {
    removeActionText: MSG.removeActionText,
  };

  componentDidMount() {
    const {
      $value: { error, file, uploaded },
    } = this.props;

    if (file && !error && !uploaded) {
      this.uploadFile();
    }
  }

  readFiles: (files: Array<Object>) => Promise<Array<Object>> = fileReader({
    maxFilesLimit: 1,
  });

  handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { idx, remove } = this.props;
    evt.stopPropagation();
    remove(idx);
  };

  async uploadFile() {
    const { $value, setValue, upload } = this.props;
    let readFile;
    let fileReference;
    const { file } = $value;
    try {
      readFile = await this.read(file);
      fileReference = await upload(readFile.data);
    } catch (e) {
      // TODO better error handling here
      setValue({ ...$value, error: 'uploadError' });
      return;
    }
    setValue({ ...$value, uploaded: fileReference });
  }

  read = (file: File) => this.readFiles([file]).then(contents => contents[0]);

  render() {
    const {
      $error,
      $value: { file, uploaded },
      formatIntl,
      removeActionText,
      removeActionTextValues,
    } = this.props;

    return (
      <div className={styles.uploadItem} aria-invalid={!!$error}>
        <div className={styles.fileInfo}>
          <Tooltip
            placement="left"
            content={$error}
            trigger={$error ? 'hover' : 'disabled'}
          >
            <span className={styles.itemIcon}>
              <Icon name="file" title={file.name} />
            </span>
          </Tooltip>
          {uploaded || $error ? (
            <span className={styles.itemName}>{file.name}</span>
          ) : (
            <div className={styles.itemProgress}>
              <ProgressBar value={uploaded ? 100 : 0} />
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            onClick={this.handleRemoveClick}
            appearance={{ theme: 'blue' }}
          >
            {formatIntl(removeActionText, removeActionTextValues)}
          </Button>
        </div>
      </div>
    );
  }
}

const validate = (value: UploadFile) =>
  value.error ? MSG[value.error] : undefined;

export default asField({ alwaysConnected: true, validate })(UploadItem);
