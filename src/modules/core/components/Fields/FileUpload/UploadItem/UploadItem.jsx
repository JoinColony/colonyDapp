/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { MessageDescriptor } from 'react-intl';
import fileReader from '~lib/fileReader';

import asField from '../../asField';
import Popover from '../../../Popover';
import Button from '../../../Button';
import Icon from '../../../Icon';
import ProgressBar from '../../../ProgressBar';

import styles from './UploadItem.css';

const MSG = defineMessages({
  removeActionText: {
    id: 'UploadItem.removeActionText',
    defaultMessage: 'Remove',
  },
});

type Props = {
  /** File object */
  file: Object,
  /** Index of file in list of files to be uploaded */
  idx: number,
  /** Text to be shown for removing an item */
  removeActionText: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  removeActionTextValues?: { [string]: string },
  /** Function used to remove each file from the list of files to upload */
  remove: (idx: number) => void,
  /** Function used to perform the acutal upload action of the file */
  upload: (fileData: any) => any, // TODO better typing
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  setError: (error: string) => void,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
};

type State = {
  error: any,
  uploaded: boolean,
};

const displayName = 'UploadItem';

class UploadItem extends Component<Props, State> {
  readFiles: (files: Array<Object>) => Promise<Array<Object>>;

  static defaultProps = {
    removeActionText: MSG.removeActionText,
  };

  constructor(props: Props) {
    super(props);

    // TODO remove fileslimit from filereader
    this.readFiles = fileReader({ maxFilesLimit: 1 });
  }

  componentDidMount() {
    const {
      $error: formError,
      file: { error: fileError, file, uploaded },
      setError,
    } = this.props;

    if (!!fileError && !formError) {
      setError(fileError);
      return;
    }

    if (file && !uploaded && !formError) {
      this.uploadFile(file);
    }
  }

  handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { idx, remove } = this.props;
    evt.stopPropagation();
    remove(idx);
  };

  async uploadFile(file: Object) {
    const { setValue, upload, setError } = this.props;
    let readFile;
    let fileReference;
    try {
      readFile = await this.read(file);
      fileReference = await upload(readFile.data);
    } catch (e) {
      // TODO better error handling here
      setError(e.message);
      return;
    }
    setValue({ file, uploaded: true, fileReference });
  }

  read = (file: File) => this.readFiles([file]).then(contents => contents[0]);

  render() {
    const {
      $error,
      file: { file, uploaded },
      formatIntl,
      removeActionText,
      removeActionTextValues,
    } = this.props;
    return (
      <div className={styles.uploadItem} aria-invalid={!!$error}>
        <div className={styles.fileInfo}>
          <Popover
            placement="left"
            content={$error}
            trigger={$error ? 'hover' : 'disabled'}
          >
            <span className={styles.itemIcon}>
              <Icon name="file" title={file.name} />
            </span>
          </Popover>
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

UploadItem.displayName = displayName;

export default asField({ alwaysConnected: true })(UploadItem);
